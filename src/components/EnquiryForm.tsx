"use client";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Check } from "lucide-react";
import { enquirySchema, type EnquiryValues } from "@/lib/enquiry-schema";
import { floors, project, type FloorId } from "@/config/project";
export function EnquiryForm({ configured }: { configured: boolean }) {
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
    null,
  );
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      floor: "",
      message: "",
      consent: false,
      website: "",
      startedAt: 0,
    },
  });
  const interestedFloor = useWatch({ control, name: "floor" });
  useEffect(() => {
    setValue("startedAt", Date.now());
    const handler = (event: Event) => {
      const id = (event as CustomEvent<FloorId>).detail;
      if (floors.some((f) => f.id === id))
        setValue("floor", id, { shouldDirty: true });
    };
    window.addEventListener("radian:floor", handler);
    return () => window.removeEventListener("radian:floor", handler);
  }, [setValue]);
  async function submit(values: EnquiryValues) {
    setResult(null);
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        signal: AbortSignal.timeout(15000),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setResult({
          ok: false,
          message:
            data.error ||
            "Your enquiry could not be sent. Please contact the team directly.",
        });
        return;
      }
      setResult({ ok: true, message: data.message });
      reset({
        ...values,
        name: "",
        phone: "",
        email: "",
        message: "",
        consent: false,
        website: "",
        startedAt: values.startedAt,
      });
    } catch {
      setResult({
        ok: false,
        message:
          "Delivery could not be confirmed. Please call or email the team before trying again.",
      });
    }
  }
  const error = (key: keyof EnquiryValues) =>
    errors[key] ? (
      <span className="field-error" id={`error-${key}`} role="alert">
        {errors[key]?.message}
      </span>
    ) : null;
  return (
    <section id="contact" className="section contact">
      <div className="contact-copy">
        <p className="eyebrow">09 / BEGIN A CONVERSATION</p>
        <h2>
          Your next chapter
          <br />
          starts <em>here.</em>
        </h2>
        <p>
          Discover a space for your business.
          <br />
          Speak with the RADIAN project team.
        </p>
        <div className="contact-links">
          <a href={project.phoneHref}>{project.phone}</a>
          <a href={`mailto:${project.email}`}>{project.email}</a>
        </div>
        <address>{project.office}</address>
      </div>
      <div className="form-wrap">
        <div className="enquiry-form-heading">
          <h3>Let’s find your space.</h3>
          <p aria-live="polite">{interestedFloor ? `Your enquiry: ${floors.find(f => f.id === interestedFloor)?.name ?? interestedFloor}` : "Share a few details with the project team."}</p>
        </div>
        <form
          onSubmit={handleSubmit(submit)}
          noValidate
          aria-label="Project enquiry"
        >
          <div className="form-grid">
            <div className="field">
              <label htmlFor="enquiry-name">
                Full name <span>*</span>
              </label>
              <input
                id="enquiry-name"
                autoComplete="name"
                maxLength={100}
                {...register("name")}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "error-name" : undefined}
                placeholder="Your full name"
              />
              {error("name")}
            </div>
            <div className="field">
              <label htmlFor="enquiry-phone">
                Mobile number <span>*</span>
              </label>
              <input
                id="enquiry-phone"
                type="tel"
                autoComplete="tel"
                maxLength={25}
                {...register("phone")}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "error-phone" : undefined}
                placeholder="+91"
              />
              {error("phone")}
            </div>
            <div className="field">
              <label htmlFor="enquiry-email">
                Email address <span>*</span>
              </label>
              <input
                id="enquiry-email"
                type="email"
                autoComplete="email"
                maxLength={254}
                {...register("email")}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "error-email" : undefined}
                placeholder="you@example.com"
              />
              {error("email")}
            </div>
            <div className="field">
              <label htmlFor="enquiry-floor">
                Interested floor <span>(optional)</span>
              </label>
              <select id="enquiry-floor" {...register("floor")}>
                <option value="">No preference</option>
                {floors.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field field-full">
              <label htmlFor="enquiry-message">
                Tell us a little more <span>(optional)</span>
              </label>
              <textarea
                id="enquiry-message"
                rows={3}
                maxLength={2000}
                placeholder="What are you looking for in your next workspace?"
                {...register("message")}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "error-message" : undefined}
              />
              {error("message")}
            </div>
          </div>
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="enquiry-website">Leave this blank</label>
            <input
              id="enquiry-website"
              tabIndex={-1}
              autoComplete="off"
              {...register("website")}
            />
          </div>
          <label className="consent" htmlFor="enquiry-consent">
            <input
              id="enquiry-consent"
              type="checkbox"
              {...register("consent")}
              aria-invalid={!!errors.consent}
              aria-describedby={errors.consent ? "error-consent" : undefined}
            />
            <span>
              I agree to be contacted by V Venturez about this enquiry and have
              read the{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                privacy notice
              </a>
              .
            </span>
          </label>
          {error("consent")}
          {!configured && (
            <p className="form-notice">
              {process.env.NODE_ENV === "development"
                ? "Development preview: enquiry delivery is not configured. "
                : ""}
              Online enquiries are not connected yet. Please call or email the
              team directly.
            </p>
          )}
          <div className="form-submit">
            <button
              className="button button-dark"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle size={17} className="spin" />
                  Sending enquiry…
                </>
              ) : (
                "Send enquiry"
              )}
            </button>
            <span>Fields marked * are required.</span>
          </div>
          {result && (
            <div
              className={`form-result ${result.ok ? "success" : "failure"}`}
              role={result.ok ? "status" : "alert"}
            >
              {result.ok && <Check size={20} />}
              <p>{result.message}</p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
