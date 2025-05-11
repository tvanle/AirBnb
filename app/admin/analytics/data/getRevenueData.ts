import prisma from "@/lib/prismadb";

export async function getRevenueData() {
  const reservations = await prisma.reservation.findMany({
    select: {
      createdAt: true,
      totalPrice: true,
    },
  });

  // Khai báo kiểu cho monthlyRevenue
  const monthlyRevenue: Record<string, number> = {};

  const result = reservations.reduce((acc, reservation) => {
    const month = new Date(reservation.createdAt).toLocaleString("default", {
      month: "short",
    });
    if (!acc[month]) acc[month] = 0;
    acc[month] += reservation.totalPrice;
    return acc;
  }, monthlyRevenue);

  return Object.entries(result).map(([name, revenue]) => ({ name, revenue }));
}
