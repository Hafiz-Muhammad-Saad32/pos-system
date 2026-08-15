import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Leaf,
  Quote,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import heroDish from "@/assets/hero-dish.jpg";
import interior from "@/assets/interior.jpg";
import { Reveal } from "@/components/common/Reveal";
import { StarRating } from "@/components/common/StarRating";
import { FoodGrid } from "@/components/food/FoodGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFeaturedFoods, getPopularFoods } from "@/services/foodService";

// Static category labels — UI only, no data here
const CATEGORIES: { name: string; blurb: string }[] = [
  { name: "Burgers", blurb: "Dry-aged, charcoal-grilled" },
  { name: "Pizza", blurb: "72-hour fermented dough" },
  { name: "Chicken", blurb: "Free-range, fire-kissed" },
  { name: "Sides", blurb: "Small plates, big flavour" },
  { name: "Drinks", blurb: "Bar-grade pours" },
  { name: "Desserts", blurb: "Pastry counter classics" },
];

// Static reviews — replace with GET /api/reviews when backend is ready
const REVIEWS = [
  {
    id: "rv-1",
    name: "Amara Diallo",
    role: "Regular since 2021",
    rating: 5,
    quote:
      "The signature burger arrives thirty minutes after I tap order and still tastes like it left the grill seconds ago. Nothing else in the city is this consistent.",
  },
  {
    id: "rv-2",
    name: "Julian Reyes",
    role: "Food writer",
    rating: 5,
    quote:
      "Meridian treats delivery like service. Warm plates, precise packing, and a kitchen that clearly refuses to cut corners after 9pm.",
  },
  {
    id: "rv-3",
    name: "Priya Raman",
    role: "Weekly orders",
    rating: 4,
    quote:
      "Tracking is genuinely useful — I know when to set the table. The harissa chicken has become a Friday ritual for the whole household.",
  },
];


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meridian — Fire-grilled plates, delivered" },
      {
        name: "description",
        content:
          "Order from Meridian: dry-aged burgers, wood-fired pizza, free-range chicken and pastry-counter desserts, delivered warm across the city.",
      },
      { property: "og:title", content: "Meridian — Fire-grilled plates, delivered" },
      {
        property: "og:description",
        content: "Dry-aged burgers, wood-fired pizza and bar-grade drinks, delivered warm.",
      },
    ],
  }),
  component: HomePage,
});

const WHY = [
  {
    icon: Leaf,
    title: "Produce picked today",
    body: "We buy from three local farms every morning. Nothing sits, nothing is frozen.",
  },
  {
    icon: Clock,
    title: "Thirty-minute promise",
    body: "Insulated packing and tight delivery zones keep plates hot on arrival.",
  },
  {
    icon: Sparkles,
    title: "Chef-led kitchen",
    body: "Every dish is signed off by our head chef before it leaves the pass.",
  },
  {
    icon: ShieldCheck,
    title: "Secure payment",
    body: "Card, wallet or cash on delivery — handled with bank-grade encryption.",
  },
];

const STEPS = [
  { title: "Choose your food", body: "Browse the full menu or search for a craving." },
  { title: "Add to cart", body: "Adjust quantities and save favourites for next time." },
  { title: "Checkout", body: "Confirm your address and pick how you'd like to pay." },
  { title: "Track your order", body: "Follow every step from the pass to your door." },
];

function HomePage() {
  const reduced = useReducedMotion();
  const featured = useQuery({ queryKey: ["foods", "featured"], queryFn: getFeaturedFoods });
  const popular = useQuery({ queryKey: ["foods", "popular"], queryFn: getPopularFoods });
  const [email, setEmail] = useState("");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div className="min-w-0">
            <motion.p
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="eyebrow"
            >
              Kitchen & Bar · San Francisco
            </motion.p>
            <motion.h1
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="display-xl mt-5 text-foreground"
            >
              Cooked over fire.
              <br />
              Delivered still warm.
            </motion.h1>
            <motion.p
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              Dry-aged beef, 72-hour dough and produce picked the same morning. Meridian
              runs one kitchen, one standard, and a delivery window we actually keep.
            </motion.p>
            <motion.div
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Button asChild size="lg" className="rounded-full px-7">
                <Link to="/menu">
                  Order now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                <Link to="/menu" search={{ q: "", category: "All" }}>
                  Explore menu
                </Link>
              </Button>
            </motion.div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <StarRating value={4.8} /> 2,400+ reviews
              </span>
              <span className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" /> Free delivery over $45
              </span>
            </div>
          </div>

          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <img
              src={heroDish}
              alt="Meridian signature dry-aged truffle burger on slate"
              width={1408}
              height={1408}
              className="aspect-square w-full rounded-2xl object-cover shadow-elevated"
            />
            <div className="absolute -bottom-6 left-6 right-6 rounded-xl border border-border bg-card/95 p-4 backdrop-blur sm:left-auto sm:right-8 sm:w-64">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Tonight's icon
              </p>
              <p className="mt-1 font-display text-xl text-foreground">
                Signature Burger
              </p>
              <p className="mt-1 text-sm text-primary">$18.50 · ready in 18 min</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      <section className="container-page py-20 pt-24">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Chef's selection</p>
            <h2 className="display-lg mt-3 text-foreground">Featured this week</h2>
          </div>
          <Link
            to="/menu"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            View the full menu
          </Link>
        </Reveal>
        <FoodGrid foods={featured.data ?? []} isLoading={featured.isLoading} skeletonCount={3} />
      </section>

      {/* Categories */}
      <section className="border-y border-border bg-surface py-20">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">Browse by</p>
            <h2 className="display-lg mt-3 text-foreground">Categories</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category, index) => (
              <Reveal key={category.name} delay={index * 0.04}>
                <Link
                  to="/menu"
                  search={{ q: "", category: category.name }}
                  className="group flex items-center justify-between rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
                >
                  <span>
                    <span className="block font-display text-2xl text-foreground">
                      {category.name}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {category.blurb}
                    </span>
                  </span>
                  <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Popular */}
      <section className="container-page py-20">
        <Reveal className="mb-10">
          <p className="eyebrow">Ordered most</p>
          <h2 className="display-lg mt-3 text-foreground">Popular right now</h2>
        </Reveal>
        <FoodGrid foods={popular.data ?? []} isLoading={popular.isLoading} />
      </section>

      {/* Why Meridian */}
      <section className="border-y border-border bg-surface py-20">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">Why Meridian</p>
            <h2 className="display-lg mt-3 max-w-2xl text-foreground">
              A restaurant kitchen that takes delivery seriously
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-primary">
                  <item.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-20">
        <Reveal>
          <p className="eyebrow">How it works</p>
          <h2 className="display-lg mt-3 text-foreground">Four steps to dinner</h2>
        </Reveal>
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.05}>
              <li className="border-t border-border pt-6">
                <span className="font-display text-3xl text-primary">
                  0{index + 1}
                </span>
                <h3 className="mt-3 text-lg text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Reviews */}
      <section className="border-y border-border bg-surface py-20">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">Guest book</p>
            <h2 className="display-lg mt-3 text-foreground">What regulars say</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {REVIEWS.map((review, index) => (
              <Reveal key={review.id} delay={index * 0.06}>
                <figure className="flex h-full flex-col rounded-xl border border-border bg-card p-7">
                  <Quote className="h-6 w-6 text-primary" aria-hidden />
                  <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-foreground/90">
                    {review.quote}
                  </blockquote>
                  <figcaption className="mt-6 border-t border-border pt-5">
                    <span className="block text-sm font-medium text-foreground">
                      {review.name}
                    </span>
                    <span className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      {review.role} · <StarRating value={review.rating} />
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurant CTA */}
      <section className="container-page py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-border">
            <img
              src={interior}
              alt="The Meridian dining room"
              loading="lazy"
              width={1408}
              height={912}
              className="h-105 w-full object-cover"
            />
            <div className="absolute inset-0 bg-background/70" />
            <div className="absolute inset-0 flex flex-col items-start justify-center gap-5 p-8 sm:p-14">
              <p className="eyebrow">Dine in or order out</p>
              <h2 className="display-lg max-w-xl text-foreground">
                The same kitchen, whether you're at table nine or on your sofa
              </h2>
              <Button asChild size="lg" className="rounded-full px-7">
                <Link to="/menu">Start an order</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Newsletter */}
      <section className="border-t border-border bg-surface py-20">
        <div className="container-page grid gap-8 md:grid-cols-2 md:items-center">
          <Reveal>
            <p className="eyebrow">Meridian updates</p>
            <h2 className="display-lg mt-3 text-foreground">
              Seasonal menus, first
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              One email a month: new dishes, chef collaborations and the odd invitation to
              a tasting night. No noise.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                if (!/^\S+@\S+\.\S+$/.test(email)) {
                  toast.error("Enter a valid email address");
                  return;
                }
                toast.success("You're on the list");
                setEmail("");
              }}
            >
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@email.com"
                aria-label="Email address"
                className="h-12 rounded-full bg-card px-5"
                maxLength={255}
              />
              <Button type="submit" size="lg" className="rounded-full px-7">
                Subscribe
              </Button>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
