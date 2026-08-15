import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";

import { Logo } from "@/components/brand/Logo";
const CATEGORIES = ["Burgers","Pizza","Chicken","Sides","Drinks","Desserts"].map((n) => ({ name: n }));

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            A modern kitchen and bar built on fire, fermentation and produce picked the
            same morning. Delivered across the city, seven days a week.
          </p>
          <div className="mt-6 flex gap-2">
            {[
              { icon: Instagram, label: "Instagram" },
              { icon: Twitter, label: "Twitter" },
              { icon: Youtube, label: "YouTube" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Site">
          <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-foreground">
            Explore
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link to="/menu" className="hover:text-primary">
                Menu
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary">
                Our story
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-primary">
                Track an order
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Menu categories">
          <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-foreground">
            The menu
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            {CATEGORIES.map((category) => (
              <li key={category.name}>
                <Link
                  to="/menu"
                  search={{ q: "", category: category.name }}
                  className="hover:text-primary"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-foreground">
            Visit & contact
          </h3>
          <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span>
                219 Meridian Row
                <br />
                San Francisco, CA 94109
              </span>
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
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Meridian Kitchen & Bar. All rights reserved.</p>
          <ul className="flex flex-wrap gap-6">
            <li>
              <a href="#" className="hover:text-primary">
                Privacy policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Terms of service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Allergen information
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
