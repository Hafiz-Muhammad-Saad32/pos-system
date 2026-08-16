import { Clock, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { PageMeta } from "@/components/common/PageMeta";
import { Reveal } from "@/components/common/Reveal";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// Opening hours — update these when backend settings API is ready
const OPENING_HOURS = [
  { day: "Monday — Thursday", hours: "12:00 — 23:00" },
  { day: "Friday — Saturday", hours: "12:00 — 01:00" },
  { day: "Sunday", hours: "13:00 — 22:00" },
];

const schema = z.object({
  name: z.string().trim().min(2, { message: "Enter your name" }).max(100),
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  subject: z.string().trim().min(3, { message: "Add a subject" }).max(120),
  message: z.string().trim().min(10, { message: "Tell us a little more" }).max(1000),
});

export function ContactPage() {
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        next[String(issue.path[0])] = issue.message;
      });
      setErrors(next);
      return;
    }
    setErrors({});
    setPending(true);
    setTimeout(() => {
      setPending(false);
      setValues({ name: "", email: "", subject: "", message: "" });
      toast.success("Message sent", {
        description: "The team replies within one working day.",
      });
    }, 700);
  }

  return (
    <>
      <PageMeta
        title="Contact — Meridian Kitchen & Bar"
        description="Reach the Meridian team: phone, email, address, opening hours and a direct message form for bookings and events."
        ogDescription="Phone, email, address, opening hours and a direct message form."
      />
      <PageHeader
        eyebrow="Say hello"
        title="Get in touch"
        description="Questions about an order, a large booking or a private event? The team on Meridian Row reads every message."
      />

      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.1fr_1fr]">
        <Reveal className="min-w-0">
          <form
            className="rounded-2xl border border-border bg-card p-7"
            onSubmit={onSubmit}
            noValidate
          >
            <h2 className="text-xl text-foreground">Send a message</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="c-name">Name</Label>
                <Input
                  id="c-name"
                  maxLength={100}
                  value={values.name}
                  onChange={(event) => setValues({ ...values, name: event.target.value })}
                  className="mt-2 h-11"
                />
                {errors["name"] ? (
                  <p className="mt-2 text-xs text-destructive">{errors["name"]}</p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="c-email">Email</Label>
                <Input
                  id="c-email"
                  type="email"
                  maxLength={255}
                  value={values.email}
                  onChange={(event) => setValues({ ...values, email: event.target.value })}
                  className="mt-2 h-11"
                />
                {errors["email"] ? (
                  <p className="mt-2 text-xs text-destructive">{errors["email"]}</p>
                ) : null}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="c-subject">Subject</Label>
                <Input
                  id="c-subject"
                  maxLength={120}
                  value={values.subject}
                  onChange={(event) => setValues({ ...values, subject: event.target.value })}
                  className="mt-2 h-11"
                />
                {errors["subject"] ? (
                  <p className="mt-2 text-xs text-destructive">{errors["subject"]}</p>
                ) : null}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="c-message">Message</Label>
                <Textarea
                  id="c-message"
                  rows={6}
                  maxLength={1000}
                  value={values.message}
                  onChange={(event) => setValues({ ...values, message: event.target.value })}
                  className="mt-2"
                />
                {errors["message"] ? (
                  <p className="mt-2 text-xs text-destructive">{errors["message"]}</p>
                ) : null}
              </div>
            </div>
            <Button type="submit" className="mt-6 h-11 rounded-full px-7" disabled={pending}>
              {pending ? "Sending…" : "Send message"}
            </Button>
          </form>
        </Reveal>

        <Reveal delay={0.08} className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-7">
            <h2 className="text-xl text-foreground">Find us</h2>
            <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                219 Meridian Row, San Francisco, CA 94109
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <a href="tel:+14155550120" className="hover:text-primary">
                  +1 (415) 555 0120
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <a href="mailto:hello@meridian.com" className="hover:text-primary">
                  hello@meridian.com
                </a>
              </li>
            </ul>
            <div className="mt-6 flex gap-2">
              {[
                { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "Twitter" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-7">
            <h2 className="flex items-center gap-2 text-xl text-foreground">
              <Clock className="h-4 w-4 text-primary" aria-hidden /> Opening hours
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {OPENING_HOURS.map((entry) => (
                <li key={entry.day} className="flex justify-between gap-4">
                  <span className="text-muted-foreground">{entry.day}</span>
                  <span className="tabular-nums text-foreground">{entry.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="grid h-56 place-items-center rounded-2xl border border-dashed border-border bg-surface text-center text-sm text-muted-foreground"
            role="img"
            aria-label="Map placeholder for 219 Meridian Row"
          >
            <span>
              <MapPin className="mx-auto mb-2 h-5 w-5 text-primary" aria-hidden />
              Interactive map arrives with the live location service
            </span>
          </div>
        </Reveal>
      </div>
    </>
  );
}
