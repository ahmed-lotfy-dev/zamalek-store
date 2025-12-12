"use client";

import { XCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function ErrorContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const code = searchParams.get("code");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-4 pt-8 pb-0">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <XCircle size={40} />
          </div>
          <h1 className="text-2xl font-bold text-center">Payment Failed</h1>
        </CardHeader>
        <div className="flex flex-col gap-6 p-8 text-center">
          <p className="text-muted-foreground">
            {message ||
              "We couldn't process your payment. Please try again or use a different payment method."}
          </p>
          {code && (
            <p className="text-sm text-muted-foreground">Error Code: {code}</p>
          )}
          <div className="flex flex-col gap-3">
            <Link
              href="/checkout"
              className="w-full"
            >
              <Button className="w-full font-medium">Try Again</Button>
            </Link>
            <Link
              href="/"
              className="w-full"
            >
              <Button variant="outline" className="w-full font-medium">Return to Home</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function CheckoutErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
