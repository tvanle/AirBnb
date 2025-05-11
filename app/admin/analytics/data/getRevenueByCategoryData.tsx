import prisma from "@/lib/prismadb";

export async function getRevenueByCategoryData() {
  const reservations = await prisma.reservation.findMany({
    select: {
      totalPrice: true,
      listing: {
        select: {
          category: true,
        },
      },
    },
  });

  // Khai báo kiểu cho acc
  const revenueByCategory: Record<string, number> = {};

  const result = reservations.reduce((acc, reservation) => {
    const category = reservation.listing?.category || "Unknown";
    if (!acc[category]) acc[category] = 0;
    acc[category] += reservation.totalPrice;
    return acc;
  }, revenueByCategory);

  return Object.entries(result).map(([name, revenue]) => ({ name, revenue }));
}
