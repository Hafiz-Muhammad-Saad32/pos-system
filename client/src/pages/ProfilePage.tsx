import { useNavigate } from "react-router-dom";

import { PageMeta } from "@/components/common/PageMeta";
import { LogOut, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";
import { changePassword, updateProfile } from "@/services/customerService";

export function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [personal, setPersonal] = useState({ name: "", email: "", phone: "" });
  const [address, setAddress] = useState({ address: "", city: "", postalCode: "" });
  const [passwords, setPasswords] = useState({ current: "", next: "" });
  const [marketing, setMarketing] = useState(true);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!user) return;
    setPersonal({ name: user.name, email: user.email, phone: user.phone });
    setAddress(user.address);
  }, [user]);

  async function save() {
    if (!user) return;
    setPending(true);
    try {
      const next = await updateProfile({ ...personal, address });
      setUser(next);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save changes");
    } finally {
      setPending(false);
    }
  }

  async function onChangePassword() {
    try {
      const result = await changePassword(passwords.current, passwords.next);
      setPasswords({ current: "", next: "" });
      toast.success(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update password");
    }
  }

  if (!user) return null;

  return (
    <>
      <PageMeta
        title="Profile — Meridian"
        description="Manage your Meridian account details and delivery address."
        ogDescription="Manage your account and delivery address."
      />
      <PageHeader eyebrow="Account" title={user.name} description={user.email} />

      <div className="container-page grid gap-6 py-12 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl text-foreground">Personal information</h2>
          <div className="mt-5 space-y-5">
            {[
              { id: "name", label: "Name" },
              { id: "email", label: "Email" },
              { id: "phone", label: "Phone" },
            ].map((field) => (
              <div key={field.id}>
                <Label htmlFor={`p-${field.id}`}>{field.label}</Label>
                <Input
                  id={`p-${field.id}`}
                  maxLength={255}
                  value={personal[field.id as keyof typeof personal]}
                  onChange={(event) => setPersonal({ ...personal, [field.id]: event.target.value })}
                  className="mt-2 h-11"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl text-foreground">Delivery address</h2>
          <div className="mt-5 space-y-5">
            {[
              { id: "address", label: "Address" },
              { id: "city", label: "City" },
              { id: "postalCode", label: "Postal code" },
            ].map((field) => (
              <div key={field.id}>
                <Label htmlFor={`a-${field.id}`}>{field.label}</Label>
                <Input
                  id={`a-${field.id}`}
                  maxLength={200}
                  value={address[field.id as keyof typeof address]}
                  onChange={(event) => setAddress({ ...address, [field.id]: event.target.value })}
                  className="mt-2 h-11"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl text-foreground">Account settings</h2>
          <div className="mt-5 flex items-center justify-between rounded-xl border border-border p-4">
            <Label htmlFor="marketing" className="text-sm text-foreground">
              Monthly menu email
            </Label>
            <Switch id="marketing" checked={marketing} onCheckedChange={setMarketing} />
          </div>
          <Button className="mt-6 h-11 w-full rounded-full" onClick={save} disabled={pending}>
            {pending ? "Saving…" : "Save changes"}
          </Button>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 text-xl text-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden /> Security
          </h2>
          <div className="mt-5 space-y-5">
            <div>
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwords.current}
                onChange={(event) => setPasswords({ ...passwords, current: event.target.value })}
                className="mt-2 h-11"
              />
            </div>
            <div>
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwords.next}
                onChange={(event) => setPasswords({ ...passwords, next: event.target.value })}
                className="mt-2 h-11"
              />
            </div>
            <Button
              variant="outline"
              className="h-11 w-full rounded-full"
              onClick={onChangePassword}
            >
              Update password
            </Button>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="mt-6 w-full rounded-full text-destructive">
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Log out of Meridian?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your cart is kept on this device, but you'll need to sign in again to check out or
                  track orders.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-full">Stay signed in</AlertDialogCancel>
                <AlertDialogAction
                  className="rounded-full"
                  onClick={async () => {
                    await logout();
                    navigate("/", { replace: true });
                  }}
                >
                  Log out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      </div>
    </>
  );
}
