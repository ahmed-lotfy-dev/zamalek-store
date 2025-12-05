"use client";

import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { verifyStripePayment } from "@/app/lib/actions/checkout";
import { useCart } from "@/app/context/cart-context";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const { clearCart } = useCart();
  const hasCleared = useRef(false);

  useEffect(() => {
    // Prevent running multiple times
    if (hasCleared.current) return;

    if (!sessionId) {
      // No session_id means Kashier, Paymob, or COD payment
      // Clear cart immediately for these payment methods
      hasCleared.current = true;
      setStatus("success");
      clearCart();
      return;
    }

    // For Stripe payments, verify first then clear cart
    const verify = async () => {
      try {
        const result = await verifyStripePayment(sessionId);
        if (result.success) {
          hasCleared.current = true;
          setStatus("success");
          clearCart();
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Verification failed", error);
        setStatus("error");
      }
    };

    verify();
  }, [sessionId, clearCart]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 flex items-center justify-center">
          <Loader2 className="animate-spin w-8 h-8 text-primary" />
          <p className="mt-4 text-default-500">Verifying payment...</p>
        </Card>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-col items-center gap-4 pt-8 pb-0">
            <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center text-danger">
              <XCircle size={40} />
            </div>
            <h1 className="text-2xl font-bold text-center">Payment Failed</h1>
          </CardHeader>
          <CardBody className="flex flex-col gap-6 p-8 text-center">
            <p className="text-default-500">
              We could not verify your payment. Please try again or contact
              support.
            </p>
            <Button
              as={Link}
              href="/checkout"
              color="primary"
              className="w-full"
            >
              Try Again
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-4 pt-8 pb-0">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center text-success">
            <CheckCircle size={40} />
          </div>
          <h1 className="text-2xl font-bold text-center">
            Payment Successful!
          </h1>
        </CardHeader>
        <CardBody className="flex flex-col gap-6 p-8 text-center">
          <p className="text-default-500">
            Thank you for your purchase. Your order has been confirmed and will
            be shipped shortly.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              as={Link}
              href="/profile"
              color="primary"
              className="w-full font-medium"
            >
              View Order History
            </Button>
            <Button
              as={Link}
              href="/"
              variant="bordered"
              className="w-full font-medium"
            >
              Continue Shopping
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
