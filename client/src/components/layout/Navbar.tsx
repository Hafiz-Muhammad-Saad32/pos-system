import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingBag,
  User as UserIcon,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Logo } from "@/components/brand/Logo";
import { SearchDialog } from "@/components/layout/SearchDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return cn(
    "rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
    isActive && "text-primary",
  );
}

function mobileNavLinkClassName({ isActive }: { isActive: boolean }) {
  return cn(
    "block rounded-xl px-3 py-3 font-display text-2xl text-foreground transition-colors",
    isActive && "text-primary",
  );
}

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { count } = useCart();
  const { ids: favoriteIds } = useFavorites();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await logout();
    setMobileOpen(false);
    navigate("/", { replace: true });
  }

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled ? "glass-panel border-b border-border" : "bg-transparent",
        )}
      >
        <div className="container-page flex h-[72px] items-center justify-between gap-4">
          <Logo size="sm" />

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={navLinkClassName}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search the menu"
              className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Search className="h-[1.15rem] w-[1.15rem]" />
            </button>

            <Link
              to="/favorites"
              aria-label="Favourites"
              className="relative hidden h-10 w-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:grid"
            >
              <Heart className="h-[1.15rem] w-[1.15rem]" />
              {favoriteIds.length ? (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
              ) : null}
            </Link>

            <Link
              to="/cart"
              aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
              className="relative grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ShoppingBag className="h-[1.15rem] w-[1.15rem]" />
              <AnimatePresence>
                {count > 0 ? (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[0.65rem] font-semibold text-primary-foreground"
                  >
                    {count}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </Link>

            {isAuthenticated && user ? (
              <div className="hidden lg:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="ml-1 flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3 text-sm transition-colors hover:border-primary/40"
                      aria-label="Account menu"
                    >
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {user.name.charAt(0)}
                      </span>
                      <span className="max-w-24 truncate text-foreground">
                        {user.name.split(" ")[0]}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/orders">
                        <Package className="mr-2 h-4 w-4" /> My orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/favorites">
                        <Heart className="mr-2 h-4 w-4" /> Favourites
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <UserIcon className="mr-2 h-4 w-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden items-center gap-2 lg:flex">
                <Button asChild variant="ghost" size="sm" className="rounded-full">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild size="sm" className="rounded-full">
                  <Link to="/signup">Sign up</Link>
                </Button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              className="grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors hover:bg-accent lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            />
            <motion.aside
              role="dialog"
              aria-label="Navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col border-l border-border bg-card"
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <Logo size="sm" withWordmark={false} />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation"
                  className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Mobile">
                <ul className="space-y-1">
                  {NAV_LINKS.map((link) => (
                    <li key={link.to}>
                      <NavLink
                        to={link.to}
                        end={link.to === "/"}
                        className={mobileNavLinkClassName}
                      >
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 space-y-1 border-t border-border pt-6">
                  <Link
                    to="/cart"
                    className="flex items-center justify-between rounded-xl px-3 py-3 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <span className="flex items-center gap-3">
                      <ShoppingBag className="h-4 w-4" /> Cart
                    </span>
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                      {count}
                    </span>
                  </Link>
                  <Link
                    to="/favorites"
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Heart className="h-4 w-4" /> Favourites
                  </Link>
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/orders"
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <Package className="h-4 w-4" /> My orders
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <UserIcon className="h-4 w-4" /> Profile
                      </Link>
                    </>
                  ) : null}
                </div>
              </nav>

              <div className="border-t border-border p-5">
                {isAuthenticated && user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                        {user.name.charAt(0)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-foreground">{user.name}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full rounded-full"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Button asChild variant="outline" className="rounded-full">
                      <Link to="/login">Log in</Link>
                    </Button>
                    <Button asChild className="rounded-full">
                      <Link to="/signup">Sign up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
