import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

// Interface Property mà frontend đang sử dụng
export interface Property {
    id: string;
    name: string;           // Ánh xạ từ title
    category: string;       // Đã có
    location: string;       // Ánh xạ từ locationValue
    countryValue: string;   // Ánh xạ từ locationValue
    price: number;          // Đã có
    bedrooms: number;       // Ánh xạ từ roomCount
    bathrooms: number;      // Ánh xạ từ bathroomCount
    guestCount: number;     // Ánh xạ từ guestCount
    image: string;          // Ánh xạ từ imageSrc
    description: string;    // Đã có
    createdAt: string;      // Đã có
    userId: string;         // Đã có
}

export async function getProperties(): Promise<Property[]> {
    const listings = await prisma.listing.findMany();
    return listings.map((listing) => ({
        id: listing.id,
        name: listing.title,
        category: listing.category,
        location: listing.locationValue,
        countryValue: listing.locationValue, // Có thể cần logic tách country nếu locationValue có định dạng đặc biệt
        price: listing.price,
        bedrooms: listing.roomCount,
        bathrooms: listing.bathroomCount,
        guestCount: listing.guestCount,
        image: listing.imageSrc || "/placeholder.svg", // Đảm bảo có giá trị mặc định
        description: listing.description,
        createdAt: listing.createdAt.toISOString(),
        userId: listing.userId,
    }));
}

export async function getProperty(id: string): Promise<Property | null> {
    const listing = await prisma.listing.findUnique({
        where: { id },
    });
    if (!listing) return null;
    return {
        id: listing.id,
        name: listing.title,
        category: listing.category,
        location: listing.locationValue,
        countryValue: listing.locationValue,
        price: listing.price,
        bedrooms: listing.roomCount,
        bathrooms: listing.bathroomCount,
        guestCount: listing.guestCount,
        image: listing.imageSrc || "/placeholder.svg",
        description: listing.description,
        createdAt: listing.createdAt.toISOString(),
        userId: listing.userId,
    };
}

export async function addProperty(property: Partial<Property>): Promise<Property> {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        throw new Error("User not authenticated");
    }

    const newListing = await prisma.listing.create({
        data: {
            title: property.name!,
            category: property.category!,
            locationValue: property.location!, // Có thể cần logic để hợp nhất location và countryValue
            price: property.price!,
            roomCount: property.bedrooms!,
            bathroomCount: property.bathrooms!,
            guestCount: property.guestCount ?? 1, // Giá trị mặc định nếu không có
            imageSrc: property.image || "/placeholder.svg", // Sử dụng giá trị upload hoặc mặc định
            description: property.description!,
            userId: currentUser.id,
        },
    });
    return {
        id: newListing.id,
        name: newListing.title,
        category: newListing.category,
        location: newListing.locationValue,
        countryValue: newListing.locationValue,
        price: newListing.price,
        bedrooms: newListing.roomCount,
        bathrooms: newListing.bathroomCount,
        guestCount: newListing.guestCount,
        image: newListing.imageSrc || "/placeholder.svg",
        description: newListing.description,
        createdAt: newListing.createdAt.toISOString(),
        userId: newListing.userId,
    };
}

export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property | null> {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        throw new Error("User not authenticated");
    }

    const listing = await prisma.listing.findUnique({
        where: { id },
    });

    if (!listing) return null;
    if (listing.userId !== currentUser.id) {
        throw new Error("Unauthorized to update this listing");
    }

    const updatedListing = await prisma.listing.update({
        where: { id },
        data: {
            title: updates.name,
            category: updates.category,
            locationValue: updates.location,
            price: updates.price,
            roomCount: updates.bedrooms,
            bathroomCount: updates.bathrooms,
            guestCount: updates.guestCount,
            imageSrc: updates.image, // Cập nhật image từ giá trị upload
            description: updates.description,
        },
    });
    return {
        id: updatedListing.id,
        name: updatedListing.title,
        category: updatedListing.category,
        location: updatedListing.locationValue,
        countryValue: updatedListing.locationValue,
        price: updatedListing.price,
        bedrooms: updatedListing.roomCount,
        bathrooms: updatedListing.bathroomCount,
        guestCount: updatedListing.guestCount,
        image: updatedListing.imageSrc || "/placeholder.svg",
        description: updatedListing.description,
        createdAt: updatedListing.createdAt.toISOString(),
        userId: updatedListing.userId,
    };
}

export async function deleteProperty(id: string): Promise<boolean> {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        throw new Error("User not authenticated");
    }

    const listing = await prisma.listing.findUnique({
        where: { id },
    });

    if (!listing) return false;
    if (listing.userId !== currentUser.id) {
        throw new Error("Unauthorized to delete this listing");
    }

    await prisma.listing.delete({
        where: { id },
    });
    return true;
}