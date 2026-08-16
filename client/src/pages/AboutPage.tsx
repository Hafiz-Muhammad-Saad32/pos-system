import { Link } from "react-router-dom";
import { Flame, Leaf, Users } from "lucide-react";

import interior from "@/assets/interior.jpg";
import heroDish from "@/assets/hero-dish.jpg";
import { PageMeta } from "@/components/common/PageMeta";
import { Reveal } from "@/components/common/Reveal";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";

const PILLARS = [
  {
    icon: Flame,
    title: "Cooked over fire",
    body: "Charcoal grill and a wood-fired oven at the centre of the kitchen. Heat gives our food its character — everything else is restraint.",
  },
  {
    icon: Leaf,
    title: "Sourced locally",
    body: "Three farms within ninety miles, a single-boat fishmonger and a baker who starts at 3am. We publish our suppliers because we're proud of them.",
  },
  {
    icon: Users,
    title: "One standard",
    body: "The plate that leaves for delivery is the plate we'd send to table nine. Same garnish, same timing, same chef signing off.",
  },
];

export function AboutPage() {
  return (
    <>
      <PageMeta
        title="Our story — Meridian Kitchen & Bar"
        description="How Meridian began: one wood-fired oven, three local farms and a refusal to compromise between dining in and ordering out."
        ogDescription="One wood-fired oven, three local farms, one standard."
      />
      <PageHeader
        eyebrow="Since 2018"
        title="A neighbourhood kitchen that grew up"
        description="Meridian started as a twelve-seat counter with one oven. The room is bigger now, the ambition hasn't changed: cook honestly, source locally, and treat a delivery order like a reservation."
      />

      <section className="container-page grid gap-12 py-16 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <img
            src={interior}
            alt="The Meridian dining room at dusk"
            loading="lazy"
            width={1408}
            height={912}
            className="w-full rounded-2xl border border-border object-cover"
          />
        </Reveal>
        <Reveal delay={0.08} className="min-w-0">
          <h2 className="display-lg text-foreground">The story</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              Our founders met working opposite ends of the same pass — one on grill, one on pastry.
              They wanted a restaurant without theatre: excellent produce, a short menu, and prices
              that let people come back on a Tuesday.
            </p>
            <p>
              The first Meridian had twelve seats and a queue down the block. When delivery became
              half our covers, we rebuilt the kitchen around it instead of treating it as an
              afterthought — separate pass, insulated packing, tighter zones.
            </p>
            <p>
              Today one kitchen serves both rooms: the dining room on Meridian Row and every address
              within fifteen minutes of it.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-border bg-surface py-16">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">Philosophy</p>
            <h2 className="display-lg mt-3 text-foreground">Three things we don't bend on</h2>
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {PILLARS.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 0.06}>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-primary">
                  <pillar.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-xl text-foreground">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <Reveal>
          <p className="eyebrow">The team</p>
          <h2 className="display-lg mt-3 text-foreground">Who's cooking</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Ines Okafor", role: "Head chef" },
            { name: "Daniel Moretti", role: "Chef de cuisine" },
            { name: "Sofia Lange", role: "Head of pastry" },
            { name: "Marcus Hale", role: "Bar director" },
          ].map((member, index) => (
            <Reveal key={member.name} delay={index * 0.05}>
              <div className="rounded-xl border border-border bg-card p-6">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-primary font-display text-xl text-primary-foreground">
                  {member.name.charAt(0)}
                </span>
                <p className="mt-5 text-lg text-foreground">{member.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border py-16">
        <div className="container-page grid gap-10 md:grid-cols-2 md:items-center">
          <Reveal>
            <img
              src={heroDish}
              alt="Meridian signature burger"
              loading="lazy"
              width={1408}
              height={1408}
              className="w-full rounded-2xl object-cover"
            />
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="display-lg text-foreground">Hungry yet?</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              The menu changes with the season, but the signature burger isn't going anywhere. Order
              it while it's still warm from the grill.
            </p>
            <Button asChild size="lg" className="mt-8 rounded-full px-7">
              <Link to="/menu">Order now</Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
