import { Listing, Reservation, User } from "@prisma/client";
import {SafeUser} from "@/types";

export type SafeListing = Omit<Listing, "createdAt"> & {
  createdAt: string;
};

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