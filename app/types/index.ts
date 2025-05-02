import { Listing, Reservation, User } from "@prisma/client";

export type SafeListing = Omit<Listing, "createdAt"> & {
  createdAt: string;
};

export type SafeReservation = Omit<
  Reservation, 
  "createdAt" | "startDate" | "endDate" | "listing"
> & {
  createdAt: string;
  startDate: string;
  endDate: string;
  listing: SafeListing;
};

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
  amenities?: string[];
}

export interface IReservation {
  id: string;
  userId: string;
  listingId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: string;
  createdAt: Date;
  payment?: IPayment;
}

export interface IPayment {
  id: string;
  reservationId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  createdAt: Date;
}

export interface IReview {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  listingId: string;
  createdAt: Date;
  user: SafeUser;
}

export interface IMessage {
  id: string;
  content: string;
  chatId: string;
  userId: string;
  createdAt: Date;
  user: SafeUser;
}

export interface IChat {
  id: string;
  participants: SafeUser[];
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAmenity {
  id: string;
  name: string;
  icon: string;
  category: string;
} 