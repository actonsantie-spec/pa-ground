import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../prisma/client.js';

function parseDeliveryCity(address: any) {
  if (!address) return 'Unknown';
  if (typeof address === 'string') return address;
  return address.city || address.location || address.town || address.district || 'Unknown';
}

export async function getStats(req: Request, res: Response) {
  const totalUsers = await prisma.user.count();
  const totalSellers = await prisma.seller.count();
  const totalOrders = await prisma.order.count();
  const totalRevenueAgg = await prisma.order.aggregate({ _sum: { totalAmount: true } });
  const totalRevenue = totalRevenueAgg._sum.totalAmount || 0;
  const pendingSellers = await prisma.seller.count({ where: { approved: false } });

  const now = new Date();
  const activeUsers = await prisma.order.groupBy({
    by: ['buyerId'],
    where: { createdAt: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } },
    _count: { buyerId: true },
  });
  const activeUsersCount = activeUsers.length;
  const monthlyData = [] as any[];
  for (let i = 5; i >= 0; i -= 1) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);
    const ordersThisMonth = await prisma.order.findMany({
      where: { createdAt: { gte: monthStart, lt: monthEnd } },
      select: { buyerId: true, totalAmount: true },
    });
    const orderCount = ordersThisMonth.length;
    const uniqueBuyers = new Set(ordersThisMonth.map((order) => order.buyerId)).size;
    const sales = ordersThisMonth.reduce((sum, order) => sum + order.totalAmount, 0);
    monthlyData.push({
      month: monthStart.toLocaleString('default', { month: 'short' }),
      sales,
      orders: orderCount,
      users: uniqueBuyers,
    });
  }

  const categoryBreakdownRaw = await prisma.product.groupBy({
    by: ['categoryId'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 8,
  });
  const categoryIds = categoryBreakdownRaw.map((item) => item.categoryId).filter(Boolean) as string[];
  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true, name: true },
  });
  const totalCategoryCount = categoryBreakdownRaw.reduce((sum, item) => sum + item._count.id, 0);
  const categoryBreakdown = categoryBreakdownRaw.map((item) => ({
    name: categories.find((c) => c.id === item.categoryId)?.name || 'Unknown',
    percentage: totalCategoryCount ? Math.round((item._count.id / totalCategoryCount) * 100) : 0,
    orders: item._count.id,
  }));

  const topSellerGroups = await prisma.order.groupBy({
    by: ['sellerId'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 5,
  });
  const sellerIds = topSellerGroups.map((group) => group.sellerId);
  const sellers = await prisma.seller.findMany({
    where: { id: { in: sellerIds } },
    select: { id: true, businessName: true },
  });
  const topSellers = topSellerGroups.map((group) => ({
    rank: 0,
    name: sellers.find((seller) => seller.id === group.sellerId)?.businessName || 'Unknown Seller',
    sales: group._count.id,
    revenue: 0,
  })).map((item, idx) => ({ ...item, rank: idx + 1 }));

  const orderAddresses = await prisma.order.findMany({
    select: { deliveryAddress: true },
    where: { NOT: [{ deliveryAddress: { equals: Prisma.JsonNull } }] },
    take: 1000,
  });
  const locationCounts = orderAddresses.reduce((acc, order) => {
    const location = parseDeliveryCity(order.deliveryAddress);
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const totalLocationOrders = Object.values(locationCounts).reduce((sum, value) => sum + value, 0);
  const topLocations = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([location, count]) => ({
      location,
      orders: count,
      percentage: totalLocationOrders ? Math.round((count / totalLocationOrders) * 100) : 0,
    }));

  res.json({
    stats: {
      totalUsers,
      activeUsers: activeUsersCount,
      totalSellers,
      totalOrders,
      totalRevenue,
      avgOrderValue: totalOrders ? Math.round(totalRevenue / totalOrders) : 0,
      pendingSellers,
    },
    monthlyData,
    categoryBreakdown,
    topSellers,
    topLocations,
  });
}

export async function listUsers(req: Request, res: Response) {
  const { page = 1, perPage = 20, query } = req.query as any;
  const where: any = {};
  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { email: { contains: query, mode: 'insensitive' } },
    ];
  }
  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip: (page - 1) * perPage,
      take: +perPage,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
    }),
  ]);
  res.json({ data: users, total });
}

export async function updateUser(req: Request, res: Response) {
  const { id } = req.params;
  const { name, email, phone, role } = req.body as any;
  const updateData: any = {};
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (phone !== undefined) updateData.phone = phone;
  if (role !== undefined) updateData.role = role;
  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
  });
  res.json({ data: user });
}

export async function listSellersAdmin(req: Request, res: Response) {
  const { query, page = 1, perPage = 20 } = req.query as any;
  const where: any = {};
  if (query) {
    where.OR = [
      { businessName: { contains: query, mode: 'insensitive' } },
      { user: { name: { contains: query, mode: 'insensitive' } } },
    ];
  }
  const [total, sellers] = await Promise.all([
    prisma.seller.count({ where }),
    prisma.seller.findMany({
      where,
      skip: (page - 1) * perPage,
      take: +perPage,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        products: { select: { id: true } },
      },
    }),
  ]);
  const data = sellers.map((seller) => ({
    id: seller.id,
    name: seller.businessName,
    contactName: seller.user?.name || '',
    email: seller.user?.email || '',
    phone: seller.user?.phone || '',
    approved: seller.approved,
    joinDate: seller.createdAt,
    productCount: seller.products.length,
    location: 'Malawi',
  }));
  res.json({ data, total });
}

export async function updateSeller(req: Request, res: Response) {
  const { id } = req.params;
  const { approved, businessName } = req.body as any;
  const updateData: any = {};
  if (approved !== undefined) updateData.approved = approved;
  if (businessName !== undefined) updateData.businessName = businessName;
  const seller = await prisma.seller.update({
    where: { id },
    data: updateData,
  });
  res.json({ data: seller });
}

export async function listOrdersAdmin(req: Request, res: Response) {
  const { page = 1, perPage = 20, status, buyerId, sellerId } = req.query as any;
  const where: any = {};
  if (status) where.status = status;
  if (buyerId) where.buyerId = buyerId;
  if (sellerId) where.sellerId = sellerId;
  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip: (page - 1) * perPage,
      take: +perPage,
      orderBy: { createdAt: 'desc' },
      include: {
        buyer: { select: { name: true, phone: true } },
        seller: { select: { businessName: true } },
        items: { include: { product: { select: { title: true } } } },
      },
    }),
  ]);
  const data = orders.map((order) => ({
    id: order.id,
    buyerName: order.buyer?.name,
    buyerPhone: order.buyer?.phone,
    sellerName: order.seller?.businessName,
    status: order.status,
    totalAmount: order.totalAmount,
    currency: order.currency,
    deliveryAddress: order.deliveryAddress,
    createdAt: order.createdAt,
    items: order.items.map((item) => ({ productTitle: item.product.title, quantity: item.quantity, price: item.price })),
  }));
  res.json({ data, total });
}

export async function getReports(req: Request, res: Response) {
  const [totalUsers, totalSellers, totalOrders, revenueAgg, recentOrdersRaw, orderStatusGroups] = await Promise.all([
    prisma.user.count(),
    prisma.seller.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        buyer: { select: { name: true } },
        seller: { select: { businessName: true } },
      },
    }),
    prisma.order.groupBy({ by: ['status'], _count: { id: true } }),
  ]);
  const totalRevenue = revenueAgg._sum.totalAmount || 0;
  const recentOrders = recentOrdersRaw.map((order) => ({
    id: order.id,
    buyerName: order.buyer?.name,
    sellerName: order.seller?.businessName,
    status: order.status,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt,
  }));
  const orderStatusBreakdown = orderStatusGroups.map((group) => ({ status: group.status, count: group._count.id }));
  res.json({
    summary: { totalUsers, totalSellers, totalOrders, totalRevenue },
    recentOrders,
    orderStatusBreakdown,
  });
}
