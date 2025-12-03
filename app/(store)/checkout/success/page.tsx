"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full p-8 text-center">
        <CardBody className="flex flex-col items-center gap-6 overflow-visible">
          <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center text-success">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Order Placed Successfully!</h1>
            <p className="text-default-500">
              Thank you for your purchase. We have received your order and will
              process it shortly.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Button
              as={Link}
              href="/products"
              color="primary"
              size="lg"
              className="w-full font-semibold"
            >
              Continue Shopping
            </Button>
            <Button as={Link} href="/" variant="flat" className="w-full">
              Back to Home
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
