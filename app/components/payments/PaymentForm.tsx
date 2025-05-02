import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SafeReservation } from '@/app/types';
import usePayment from '@/hook/usePayment';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { toast } from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface PaymentFormProps {
  reservation: SafeReservation;
}

const PaymentFormContent: React.FC<PaymentFormProps> = ({ reservation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { initiatePayment } = usePayment();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return toast.error('Payment system is not ready');
    }

    setIsLoading(true);

    try {
      await initiatePayment(reservation.id, reservation.totalPrice);
      toast.success('Payment successful!');
      router.refresh();
      router.push('/trips');
    } catch (error) {
      toast.error('Something went wrong with the payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <form onSubmit={onSubmit}>
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment Details</h3>
            <div className="space-y-2">
              <p className="text-sm text-neutral-600">
                Total Amount:
                <span className="font-semibold ml-2">${reservation.totalPrice}</span>
              </p>
              <div className="border rounded-md p-3">
                <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#32325d',
                          '::placeholder': {
                            color: '#aab7c4',
                          },
                        },
                        invalid: {
                          color: '#dc2626',
                        },
                      },
                    }}
                />
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Processing...' : 'Pay Now'}
            </Button>
            <p className="text-xs text-neutral-500 text-center">
              Your payment is processed securely with Stripe. We never store your card details.
            </p>
          </div>
        </Card>
      </form>
  );
};

const PaymentForm: React.FC<PaymentFormProps> = ({ reservation }) => {
  const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
      : null;

  if (!stripePromise) {
    console.error('Stripe publishable key is missing');
    return null;
  }

  return (
      <Elements stripe={stripePromise}>
        <PaymentFormContent reservation={reservation} />
      </Elements>
  );
};

export default PaymentForm;