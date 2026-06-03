import { Request, Response } from 'express';
import prisma from '../prisma/client.js';
import bcrypt from 'bcrypt';
import { signToken } from '../utils/jwt.js';

function buildUserResponse(user: any) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    profilePicture: user.profilePicture,
    seller: user.seller
      ? {
          id: user.seller.id,
          businessName: user.seller.businessName,
          approved: user.seller.approved,
        }
      : undefined,
  };
}

export async function register(req: Request, res: Response) {
  const {
    name,
    email,
    password,
    role = 'BUYER',
    businessName,
    phone,
    profilePicture,
  } = req.body;

  const normalizedRole = role === 'SELLER' ? 'SELLER' : 'BUYER';

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    return res.status(409).json({
      error: 'Email already in use',
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: normalizedRole,
      phone,
      profilePicture,
      ...(normalizedRole === 'SELLER'
        ? {
            seller: {
              create: {
                businessName: businessName || name,
              },
            },
          }
        : {}),
    },
    include: {
      seller: true,
    },
  });

  const token = signToken({
    sub: user.id,
    role: user.role,
    email: user.email,
  });

  res.status(201).json({
    token,
    user: buildUserResponse(user),
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      seller: true,
    },
  });

  if (!user) {
    return res.status(401).json({
      error: 'Invalid credentials',
    });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);

  if (!ok) {
    return res.status(401).json({
      error: 'Invalid credentials',
    });
  }

  const token = signToken({
    sub: user.id,
    role: user.role,
    email: user.email,
  });

  res.json({
    token,
    user: buildUserResponse(user),
  });
}

export async function me(req: Request, res: Response) {
  // @ts-ignore
  const userId = req.user?.sub;

  if (!userId) {
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      profilePicture: true,
      seller: {
        select: {
          id: true,
          businessName: true,
          approved: true,
        },
      },
    },
  });

  res.json({
    user: buildUserResponse(user),
  });
}