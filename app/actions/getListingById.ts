import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/listing";

interface IParams {
  listingId?: string;
}

export default async function getListingById(params: IParams) {
  try {
    const { listingId } = params;

    await connectDB();
    const listing = await Listing.findById(listingId)
      .populate('user')
      .lean() as any;

    if (!listing) {
      return null;
    }

    return {
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
