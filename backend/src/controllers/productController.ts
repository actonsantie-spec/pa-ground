import { Request, Response } from 'express';
import prisma from '../prisma/client.js';

export async function listProducts(req: Request, res: Response) {
  const { page = 1, perPage = 20, query, category, sellerId } = req.query as any;
  const where: any = {};
  if (query) where.OR = [{ title: { contains: query } }, { description: { contains: query } }];
  if (category) where.categoryId = category;
  if (sellerId) where.sellerId = sellerId;
  const products = await prisma.product.findMany({
    where,
    skip: (page - 1) * perPage,
    take: +perPage,
    include: {
      seller: { select: { businessName: true } },
      category: { select: { name: true } },
    },
  });
  res.json({ data: products });
}

export async function getProduct(req: Request, res: Response) {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      seller: { select: { businessName: true } },
      category: { select: { name: true } },
    },
  });
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json({ data: product });
}

export async function createProduct(req: Request, res: Response) {
  // @ts-ignore
  const userId = req.user?.sub;
  const seller = await prisma.seller.findUnique({ where: { userId } });
  if (!seller) return res.status(403).json({ error: 'Seller profile not found' });
  const { title, description, price, stock, categoryId, images = [] } = req.body;
  const product = await prisma.product.create({
    data: {
      title,
      description,
      price: +price,
      stock: +stock || 0,
      categoryId: categoryId || null,
      images,
      sellerId: seller.id,
    },
  });
  res.status(201).json({ data: product });
}

export async function updateProduct(req: Request, res: Response) {
  const { id } = req.params;
  // @ts-ignore
  const userId = req.user?.sub;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return res.status(404).json({ error: 'Not found' });
  const seller = await prisma.seller.findUnique({ where: { id: product.sellerId } });
  if (!seller || seller.userId !== userId) return res.status(403).json({ error: 'Forbidden' });
  const data = req.body;
  const updated = await prisma.product.update({ where: { id }, data });
  res.json({ data: updated });
}

export async function deleteProduct(req: Request, res: Response) {
  const { id } = req.params;
  // @ts-ignore
  const userId = req.user?.sub;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return res.status(404).json({ error: 'Not found' });
  const seller = await prisma.seller.findUnique({ where: { id: product.sellerId } });
  if (!seller || seller.userId !== userId) return res.status(403).json({ error: 'Forbidden' });
  await prisma.product.delete({ where: { id } });
  res.status(204).send();
}
