import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";

interface IParams {
  listingId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== "string") {
      throw new Error("Invalid ID");
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(
      currentUser._id,
      { $addToSet: { favoriteIds: listingId } },
      { new: true }
    );

    return NextResponse.json(user);
  } catch (error: any) {
    console.log(error, "FAVORITE_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== "string") {
      throw new Error("Invalid ID");
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(
      currentUser._id,
      { $pull: { favoriteIds: listingId } },
      { new: true }
    );

    return NextResponse.json(user);
  } catch (error: any) {
    console.log(error, "FAVORITE_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
