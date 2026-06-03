import { PrismaClient, UserRole, OrderStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.notification.deleteMany();
  await prisma.trackingCheckpoint.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.seller.deleteMany();
  await prisma.user.deleteMany();

  const adminPass = await bcrypt.hash('adminpass', 10);
  const sellerPass = await bcrypt.hash('sellerpass', 10);
  const buyerPass = await bcrypt.hash('buyerpass', 10);

  const admin = await prisma.user.create({ data: { name: 'Admin', email: 'admin@example.com', passwordHash: adminPass, role: UserRole.ADMIN } });
  const sellerUser = await prisma.user.create({ data: { name: 'Seller', email: 'seller@example.com', passwordHash: sellerPass, role: UserRole.SELLER } });
  const buyerUser = await prisma.user.create({ data: { name: 'Buyer', email: 'buyer@example.com', passwordHash: buyerPass, role: UserRole.BUYER } });

  const seller = await prisma.seller.create({ data: { userId: sellerUser.id, businessName: 'Tech Hub Malawi' } });

  const product1 = await prisma.product.create({ data: { sellerId: seller.id, title: 'iPhone 12 Pro Max', description: 'Smartphone', price: 85000, stock: 10, images: [], categoryId: null } });
  const product2 = await prisma.product.create({ data: { sellerId: seller.id, title: 'Blue Polo T-Shirt', description: 'Clothing', price: 3500, stock: 50, images: [], categoryId: null } });

  const order = await prisma.order.create({ data: { buyerId: buyerUser.id, sellerId: seller.id, totalAmount: 88500, currency: 'MWK', paymentStatus: 'paid', deliveryAddress: { street: 'Area 4', city: 'Lilongwe', lat: -13.9626, lon: 33.7741 }, estimatedDelivery: new Date(), items: { create: [ { productId: product1.id, quantity: 1, price: 85000 }, { productId: product2.id, quantity: 1, price: 3500 } ] } }, include: { items: true } });

  await prisma.trackingCheckpoint.createMany({ data: [ { orderId: order.id, lat: -13.9626, lon: 33.7741, location: 'Lilongwe Central Hub', status: 'dispatched' }, { orderId: order.id, lat: -13.9800, lon: 33.7800, location: 'En route', status: 'transit' } ] });

  console.log('Seeding completed');
}

main()
  .catch(e => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
