import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/listing";
import getCurrentUser from "./getCurrentUser";

export default async function getFavoriteListings() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    await connectDB();
    const favorites = await Listing.find({
      _id: { $in: currentUser.favoriteIds }
    });

    const safeFavorites = favorites.map((favorite) => ({
      ...favorite.toObject(),
      createdAt: favorite.createdAt.toISOString(),
    }));

    return safeFavorites;
  } catch (error: any) {
    throw new Error(error);
  }
}
