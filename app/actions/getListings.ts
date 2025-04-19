import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/listing";

export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
}

export default async function getListings(params: IListingsParams) {
  try {
    const {
      userId,
      roomCount,
      guestCount,
      bathroomCount,
      locationValue,
      startDate,
      endDate,
      category,
    } = params;

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    if (roomCount) {
      query.roomCount = {
        $gte: +roomCount
      };
    }

    if (guestCount) {
      query.guestCount = {
        $gte: +guestCount
      };
    }

    if (bathroomCount) {
      query.bathroomCount = {
        $gte: +bathroomCount
      };
    }

    if (locationValue) {
      query.locationValue = locationValue;
    }

    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          $elemMatch: {
            $or: [
              {
                endDate: { $gte: startDate },
                startDate: { $lte: startDate }
              },
              {
                startDate: { $lte: endDate },
                endDate: { $gte: endDate }
              }
            ]
          }
        }
      };
    }

    await connectDB();
    const listings = await Listing.find(query)
      .sort({ createdAt: -1 });

    const safeListings = listings.map((listing) => ({
      ...listing.toObject(),
      createdAt: listing.createdAt.toISOString(),
    }));

    return safeListings;
  } catch (error: any) {
    throw new Error(error);
  }
}
