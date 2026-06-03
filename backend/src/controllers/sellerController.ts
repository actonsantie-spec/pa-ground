import { Request, Response } from 'express';
import prisma from '../prisma/client.js';

export async function listSellers(req: Request, res: Response) {
  const { query, page = 1, perPage = 20 } = req.query as any;
  const where: any = {};
  if (query) {
    where.businessName = { contains: query, mode: 'insensitive' };
  }

  const sellers = await prisma.seller.findMany({
    where,
    skip: (page - 1) * perPage,
    take: +perPage,
    include: {
      user: { select: { name: true, email: true, phone: true } },
      products: { select: { id: true } },
    },
  });

  const results = sellers.map((seller: any) => ({
    id: seller.id,
    name: seller.businessName,
    phone: seller.user?.phone || '',
    email: seller.user?.email || '',
    contactName: seller.user?.name || '',
    approved: seller.approved,
    joinDate: seller.createdAt,
    productCount: seller.products.length,
    location: 'Malawi',
    rating: 4.6,
    reviews: 24,
  }));

  res.json({ data: results });
}
