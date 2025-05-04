import prisma from "@/lib/prismadb";
import useCountries from "@/hook/useCountries";

export async function getRevenueByCountryData() {
    const { getByValue } = useCountries();

    const reservations = await prisma.reservation.findMany({
        select: {
            totalPrice: true,
            listing: {
                select: {
                    locationValue: true,
                },
            },
        },
    });

    // Khai báo kiểu cho revenueByLocation
    const revenueByLocation: Record<string, { revenue: number; flag: string }> = {};

    const result = reservations.reduce((acc, reservation) => {
        const locationValue = reservation.listing?.locationValue || "";
        const country = getByValue(locationValue);
        const countryName = country?.label || "Unknown";
        if (!acc[countryName]) acc[countryName] = { revenue: 0, flag: country?.flag || "" };
        acc[countryName].revenue += reservation.totalPrice;
        return acc;
    }, revenueByLocation);

    return Object.entries(result).map(([name, { revenue, flag }]) => ({
        name,
        flag,
        revenue,
    }));
}