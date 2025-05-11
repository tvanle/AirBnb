import { create } from "zustand";
import { IPayment } from "../app/types";
import axios from "axios";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface PaymentStore {
  payments: IPayment[];
  isLoading: boolean;
  error: string | null;
  fetchPayments: () => Promise<void>;
  initiatePayment: (reservationId: string, amount: number) => Promise<void>;
  processRefund: (paymentId: string) => Promise<void>;
  getPaymentStatus: (paymentId: string) => Promise<string>;
}

const usePayment = create<PaymentStore>((set) => ({
  payments: [],
  isLoading: false,
  error: null,

  fetchPayments: async () => {
    try {
      set({ isLoading: true });
      const response = await axios.get("/api/payments");
      set({ payments: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch payments", isLoading: false });
      toast.error("Could not load payments");
    }
  },

  initiatePayment: async (reservationId: string, amount: number) => {
    try {
      set({ isLoading: true });

      // Create payment intent on the server
      const response = await axios.post("/api/payments/create", {
        reservationId,
        amount,
      });

      const { clientSecret } = response.data;
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      // Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret);

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Update payment status on success
      await axios.post("/api/payments/confirm", {
        paymentIntentId: result.paymentIntent.id,
        reservationId,
      });

      set({ isLoading: false });
      toast.success("Payment processed successfully");
    } catch (error) {
      set({ error: "Payment failed", isLoading: false });
      toast.error("Payment failed");
    }
  },

  processRefund: async (paymentId: string) => {
    try {
      set({ isLoading: true });
      await axios.post(`/api/payments/${paymentId}/refund`);

      set((state) => ({
        payments: state.payments.map((payment) =>
          payment.id === paymentId
            ? { ...payment, status: "REFUNDED" }
            : payment,
        ),
        isLoading: false,
      }));

      toast.success("Refund processed successfully");
    } catch (error) {
      set({ error: "Refund failed", isLoading: false });
      toast.error("Could not process refund");
    }
  },

  getPaymentStatus: async (paymentId: string) => {
    try {
      const response = await axios.get(`/api/payments/${paymentId}/status`);
      return response.data.status;
    } catch (error) {
      toast.error("Could not get payment status");
      return "UNKNOWN";
    }
  },
}));

export default usePayment;
