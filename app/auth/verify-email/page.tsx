
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VerifyEmail() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("signup_email");
    if (storedEmail) {
      setEmail(storedEmail);
      sessionStorage.removeItem("signup_email");
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold">Check your email</h1>
          <p className="mt-4 text-muted-foreground">
            {email
              ? `Confirmation link sent to ${email}`
              : "Confirmation link sent to your email address"}
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the link in your email to verify your account.
          </p>
          <p className="text-xs text-muted-foreground">
            Did not receive the email? Check your spam folder.
          </p>
        </div>

        <div className="pt-4">
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Already verified?{" "}
          <Link href="/auth/signin" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
