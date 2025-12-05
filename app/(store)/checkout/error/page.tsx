"use client";

import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutErrorPage() {
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
            We couldn't process your payment. Please try again or use a
            different payment method.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              as={Link}
              href="/checkout"
              color="primary"
              className="w-full font-medium"
            >
              Try Again
            </Button>
            <Button
              as={Link}
              href="/"
              variant="bordered"
              className="w-full font-medium"
            >
              Return to Home
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
