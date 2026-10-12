"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { submitContactPublic } from "@/services/contact";
import { mapApiError } from "@/lib/error-messages";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/features/shared/alert";

export function ContactForm() {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!status) return;
    const id = window.setTimeout(() => setStatus(null), 4000);
    return () => window.clearTimeout(id);
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setStatus(null);

    try {
      const result = await submitContactPublic({
        name: name.trim(),
        businessName: businessName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
      });
      setStatus(result.message);
      setName("");
      setBusinessName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setError(mapApiError(err));
    } finally {
      setIsLoading(false);
    }
  }

  function clearFeedback() {
    if (status) setStatus(null);
    if (error) setError(null);
  }

  return (
    <form
      id="contact-form"
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-teal-900/10 bg-white/90 p-7 shadow-lg shadow-teal-900/5 backdrop-blur-sm sm:space-y-7 sm:p-9"
    >
      <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-6">
        <div>
          <FloatingInput
            id="name"
            label="Name"
            value={name}
            onChange={(e) => {
              clearFeedback();
              setName(e.target.value);
            }}
            required
            className="rounded-md"
          />
        </div>
        <div>
          <FloatingInput
            id="businessName"
            label="Business Name"
            value={businessName}
            onChange={(e) => {
              clearFeedback();
              setBusinessName(e.target.value);
            }}
            required
            className="rounded-md"
          />
        </div>
        <div>
          <FloatingInput
            id="email"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => {
              clearFeedback();
              setEmail(e.target.value);
            }}
            required
            className="rounded-md"
          />
        </div>
        <div>
          <FloatingInput
            id="phone"
            label="Phone"
            value={phone}
            onChange={(e) => {
              clearFeedback();
              setPhone(e.target.value);
            }}
            required
            className="rounded-md"
          />
        </div>
      </div>

      <div className="space-y-2.5 pt-1">
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          className="min-h-32 w-full rounded-md border border-input bg-white px-3.5 py-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          value={message}
          onChange={(e) => {
            clearFeedback();
            setMessage(e.target.value);
          }}
          required
        />
      </div>

      <p className="text-sm leading-6 text-slate-600">
        We use these details to respond to your enquiry and follow up about your workshop needs. Read our <Link href="/privacy" className="font-medium text-teal-700 underline underline-offset-4">Privacy Policy</Link>. Do not include passwords, payment-card details, or customer records in your message.
      </p>

      <div className="pt-1">
        <Button type="submit" size="lg" disabled={isLoading} className="w-full rounded-md sm:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending message...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>

      {error && (
        <Alert tone="error">
          <AlertTitle>Unable to submit</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {status && (
        <Alert tone="success">
          <AlertTitle>Submitted</AlertTitle>
          <AlertDescription>{status}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
