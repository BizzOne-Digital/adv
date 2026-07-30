"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { FormField, TextInput, TextSelect, TextTextarea } from "@/components/ui/FormField";
import { inquirySchema, inquiryTypeSchema, type InquiryInput } from "@/lib/validations";
import { cn } from "@/lib/utils";

const INQUIRY_TYPES = inquiryTypeSchema.options.map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}));

export type ContactFormProps = {
  className?: string;
  defaultInquiryType?: InquiryInput["inquiryType"];
};

export function ContactForm({ className, defaultInquiryType }: ContactFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema) as never,
    defaultValues: {
      inquiryType: defaultInquiryType ?? "general",
      consent: undefined,
      website: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Unable to send inquiry.");
      }
      toast.success("Message sent. Thank you for contacting CAFBEX.");
      reset({
        inquiryType: defaultInquiryType ?? "general",
        consent: undefined,
        website: "",
        fullName: "",
        email: "",
        phone: "",
        organization: "",
        country: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className={cn("relative space-y-5", className)} noValidate>
      <div className="sr-only" aria-hidden>
        <label htmlFor="inquiry-website">Website</label>
        <input
          id="inquiry-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextInput
          label="Full name"
          required
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <TextInput
          label="Email"
          type="email"
          required
          error={errors.email?.message}
          {...register("email")}
        />
        <TextInput label="Phone" error={errors.phone?.message} {...register("phone")} />
        <TextInput
          label="Organization"
          error={errors.organization?.message}
          {...register("organization")}
        />
        <TextInput label="Country" error={errors.country?.message} {...register("country")} />
        <TextSelect
          label="Inquiry type"
          required
          options={INQUIRY_TYPES}
          error={errors.inquiryType?.message}
          {...register("inquiryType")}
        />
      </div>

      <TextInput label="Subject" error={errors.subject?.message} {...register("subject")} />

      <TextTextarea
        label="Message"
        required
        rows={5}
        error={errors.message?.message}
        {...register("message")}
      />

      <FormField label="Consent" name="consent" error={errors.consent?.message} required>
        <label className="flex items-start gap-2 text-sm text-muted">
          <input type="checkbox" className="mt-1 accent-agri" {...register("consent")} />
          <span>
            I consent to CAFBEX storing and processing this information to respond to my
            inquiry. See our{" "}
            <a href="/privacy-policy" className="text-tech-blue underline">
              Privacy Policy
            </a>
            .
          </span>
        </label>
      </FormField>

      <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

export default ContactForm;
