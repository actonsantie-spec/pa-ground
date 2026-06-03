import { Request, Response } from 'express';
import prisma from '../prisma/client.js';

async function getSellerByUserId(userId: string) {
  return prisma.seller.findUnique({ where: { userId } });
}

function formatOrderResponse(order: any) {
  return {
    ...order,
    buyerName: order.buyer?.name,
    buyerPhone: order.buyer?.phone,
    deliveryAddress: order.deliveryAddress,
  };
}

export async function createOrder(req: Request, res: Response) {
  // @ts-ignore
  const userId = req.user?.sub;
  const { items, deliveryAddress, estimatedDelivery } = req.body;

  if (!items || items.length === 0) return res.status(400).json({ error: 'No items' });

  const productIds = items.map((item: any) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, sellerId: true, price: true },
  });

  if (products.length !== items.length) {
    return res.status(400).json({ error: 'One or more items are invalid' });
  }

  const sellerIds = Array.from(new Set(products.map(product => product.sellerId)));
  if (sellerIds.length > 1) {
    return res.status(400).json({ error: 'All items must belong to the same seller' });
  }

  const sellerId = sellerIds[0];
  const total = products.reduce((sum, product) => {
    const item = items.find((it: any) => it.productId === product.id);
    return sum + product.price * item.quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
      buyerId: userId,
      sellerId,
      totalAmount: total,
      currency: 'MWK',
      deliveryAddress,
      estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : undefined,
      items: {
        create: items.map((it: any) => ({
          productId: it.productId,
          quantity: it.quantity,
          price: it.price,
        })),
      },
    },
    include: { items: true },
  });

  res.status(201).json({ data: order });
}

function verifyOrderAccess(order: any, user: any, role: string) {
  if (role === 'ADMIN') return true;
  if (role === 'BUYER') return order.buyerId === user.sub;
  if (role === 'SELLER') return order.seller?.userId === user.sub || order.sellerId === user.sellerId;
  return false;
}

export async function getOrder(req: Request, res: Response) {
  const { id } = req.params;
  // @ts-ignore
  const user = req.user;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      buyer: { select: { id: true, name: true, phone: true } },
      seller: { select: { id: true, userId: true, businessName: true } },
      items: { include: { product: { select: { title: true } } } },
      checkpoints: true,
    },
  });
  if (!order) return res.status(404).json({ error: 'Not found' });
  if (!verifyOrderAccess(order, user, user.role)) return res.status(403).json({ error: 'Forbidden' });
  res.json({ data: formatOrderResponse(order) });
}

export async function listOrders(req: Request, res: Response) {
  const { buyerId, sellerId, status, page = 1, perPage = 20 } = req.query as any;
  // @ts-ignore
  const user = req.user;
  const where: any = {};

  if (user.role === 'BUYER') {
    where.buyerId = user.sub;
  } else if (user.role === 'SELLER') {
    const seller = await getSellerByUserId(user.sub);
    if (!seller) return res.status(403).json({ error: 'Seller profile not found' });
    where.sellerId = seller.id;
  } else if (user.role === 'ADMIN') {
    if (buyerId) where.buyerId = buyerId;
    if (sellerId) where.sellerId = sellerId;
  }

  if (status) where.status = status;

  const orders = await prisma.order.findMany({
    where,
    skip: (page - 1) * perPage,
    take: +perPage,
    orderBy: { createdAt: 'desc' },
    include: {
      seller: { select: { businessName: true } },
      buyer: { select: { id: true, name: true, phone: true } },
      items: { include: { product: { select: { title: true } } } },
    },
  });

  res.json({ data: orders.map(formatOrderResponse) });
}

export async function updateOrderStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body;
  // @ts-ignore
  const user = req.user;
  const order = await prisma.order.findUnique({ where: { id }, include: { seller: { select: { userId: true } } } });
  if (!order) return res.status(404).json({ error: 'Not found' });

  if (user.role === 'SELLER' && order.seller?.userId !== user.sub) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (user.role === 'BUYER') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const updated = await prisma.order.update({ where: { id }, data: { status } });
  res.json({ data: updated });
}

export async function addCheckpoint(req: Request, res: Response) {
  const { id } = req.params; // order id
  const { lat, lon, location, status } = req.body;
  // @ts-ignore
  const user = req.user;

  const order = await prisma.order.findUnique({ where: { id }, include: { seller: { select: { userId: true } } } });
  if (!order) return res.status(404).json({ error: 'Not found' });
  if (user.role === 'SELLER' && order.seller?.userId !== user.sub) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  if (user.role === 'BUYER') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const checkpoint = await prisma.trackingCheckpoint.create({ data: { orderId: id, lat: +lat, lon: +lon, location, status } });
  res.status(201).json({ data: checkpoint });
}

export async function getTracking(req: Request, res: Response) {
  const { orderId } = req.params;
  // @ts-ignore
  const user = req.user;
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { buyer: { select: { id: true } }, seller: { select: { userId: true } } } });
  if (!order) return res.status(404).json({ error: 'Not found' });
  if (user.role === 'BUYER' && order.buyerId !== user.sub) return res.status(403).json({ error: 'Forbidden' });
  if (user.role === 'SELLER' && order.seller?.userId !== user.sub) return res.status(403).json({ error: 'Forbidden' });

  const checkpoints = await prisma.trackingCheckpoint.findMany({ where: { orderId }, orderBy: { recordedAt: 'asc' } });
  res.json({
    checkpoints: checkpoints.map((cp: any) => ({ ...cp, time: cp.recordedAt })),
    currentStatus: order.status,
    currentLocation: order.deliveryAddress,
  });
}
