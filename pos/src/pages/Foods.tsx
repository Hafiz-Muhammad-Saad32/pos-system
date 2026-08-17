import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@/lib/query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { Loader2, Pencil, Plus, Search, Trash2, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, EmptyState, ErrorState } from "@/components/common/PageHeader";
import { AvailabilityBadge } from "@/components/common/StatusBadge";
import { Pagination } from "@/components/common/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { foodService, FOOD_CATEGORIES } from "@/services/foodService";
import type { FoodPayload } from "@/services/foodService";
import type { Food, FoodCategory } from "@/types";
import { formatCurrency } from "@/utils/format";
import { usePageMeta } from "@/hooks/use-page-meta";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  description: z.string().trim().min(5, "Add a short description").max(240),
  category:z.enum(FOOD_CATEGORIES as [string, ...string[]]),
  price: z.coerce.number().positive("Price must be greater than 0").max(9999),
  imageUrl: z.string().trim().url("Enter a valid image URL"),
  available: z.boolean(),
});

type FormValues = z.input<typeof schema>;

const PAGE_SIZE = 8;

export default function FoodsPage() {
  usePageMeta({
    title: "Menu management — Meridian POS",
    description: "Add, edit and toggle availability for every dish on the live menu.",
  });

  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<FoodCategory | "all">("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Food | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<Food | null>(null);

  const query = useMemo(
    () => ({ search, category, page, pageSize: PAGE_SIZE }),
    [search, category, page],
  );

  const foods = useQuery({
    queryKey: ["foods", query],
    queryFn: () => foodService.list(query),
    keepPreviousData: true,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["foods"] });
    void queryClient.invalidateQueries({ queryKey: ["stats"] });
    void queryClient.invalidateQueries({ queryKey: ["unavailable"] });
  };

  const save = useMutation({
    mutationFn: (values: FoodPayload) =>
      editing ? foodService.update(editing.id, values) : foodService.create(values),
    onSuccess: () => {
      toast.success(editing ? "Dish updated" : "Dish added to the menu");
      setDialogOpen(false);
      setEditing(null);
      invalidate();
    },
    onError: () => toast.error("Could not save this dish"),
  });

  const toggle = useMutation({
    mutationFn: (food: Food) => foodService.toggleAvailability(food.id, food.available),
    onSuccess: (food) => {
      toast.success(`${food.name} is now ${food.available ? "available" : "unavailable"}`);
      invalidate();
    },
    onError: () => toast.error("Could not update availability"),
  });

  const remove = useMutation({
    mutationFn: (food: Food) => foodService.remove(food.id),
    onSuccess: () => {
      toast.success("Dish removed from the menu");
      invalidate();
    },
    onError: () => toast.error("Could not delete this dish"),
  });

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (food: Food) => {
    setEditing(food);
    setDialogOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Menu"
        description="Manage dishes, pricing and live availability."
        actions={
          <button
            onClick={openCreate}
            className="focus-ring inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" /> Add food
          </button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search dishes…"
            aria-label="Search dishes"
            className="focus-ring h-10 w-full rounded-xl border border-border bg-surface-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value as FoodCategory | "all");
            setPage(1);
          }}
          aria-label="Filter by category"
          className="focus-ring h-10 rounded-xl border border-border bg-surface-2 px-3 text-sm outline-none"
        >
          <option value="all">All categories</option>
          {FOOD_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {foods.isError ? (
        <ErrorState onRetry={() => foods.refetch()} />
      ) : foods.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      ) : foods.data && foods.data.data.length === 0 ? (
        <div className="panel">
          <EmptyState
            icon={UtensilsCrossed}
            title="No dishes found"
            description="Adjust your search, or add a new dish to the menu."
            action={
              <button
                onClick={openCreate}
                className="focus-ring rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Add food
              </button>
            }
          />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {foods.data?.data.map((food, i) => (
              <motion.article
                key={food.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 8) * 0.04, duration: 0.28 }}
                className={cn(
                  "panel group flex flex-col overflow-hidden",
                  !food.available && "opacity-75",
                )}
              >
                <div className="relative aspect-4/3 overflow-hidden bg-surface-2">
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    loading="lazy"
                    className={cn(
                      "size-full object-cover transition-transform duration-500 group-hover:scale-105",
                      !food.available && "grayscale",
                    )}
                  />
                  <span className="absolute left-3 top-3">
                    <AvailabilityBadge available={food.available} />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="min-w-0 truncate text-sm font-semibold">{food.name}</h3>
                    <span className="numeric shrink-0 text-sm font-semibold text-primary">
                      {formatCurrency(food.price)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {food.description}
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {food.category}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Switch
                        checked={food.available}
                        onCheckedChange={() => toggle.mutate(food)}
                        aria-label={`Toggle availability for ${food.name}`}
                      />
                      Available
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(food)}
                        aria-label={`Edit ${food.name}`}
                        className="focus-ring grid size-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleting(food)}
                        aria-label={`Delete ${food.name}`}
                        className="focus-ring grid size-8 place-items-center rounded-lg border border-destructive/30 text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {foods.data && foods.data.totalPages > 1 && (
            <div className="panel">
              <Pagination
                page={foods.data.page}
                totalPages={foods.data.totalPages}
                total={foods.data.total}
                pageSize={foods.data.pageSize}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}

      <FoodDialog
        key={editing?.id ?? "new"}
        open={dialogOpen}
        food={editing}
        pending={save.isPending}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditing(null);
        }}
        onSubmit={(values) => save.mutate(values)}
      />

      <AlertDialog open={deleting !== null} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{deleting?.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This dish will be removed from the menu and from the WhatsApp ordering
              catalogue. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep dish</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleting) remove.mutate(deleting);
                setDeleting(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function FoodDialog({
  open,
  food,
  pending,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  food: Food | null;
  pending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: FoodPayload) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: food?.name ?? "",
      description: food?.description ?? "",
      category: food?.category ?? "Mains",
      price: food?.price ?? 0,
      imageUrl:
        food?.imageUrl ??
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=70",
      available: food?.available ?? true,
    },
  });

  const available = watch("available");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{food ? "Edit dish" : "Add dish"}</DialogTitle>
          <DialogDescription>
            Details here appear on the POS and in the WhatsApp ordering catalogue.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((values) =>
            onSubmit(schema.parse(values) as FoodPayload),
          )}
          className="space-y-4"
          noValidate
        >
          <Field label="Food name" error={errors.name?.message}>
            <input
              {...register("name")}
              className="focus-ring h-10 w-full rounded-xl border border-border bg-surface-2 px-3 text-sm outline-none"
            />
          </Field>

          <Field label="Description" error={errors.description?.message}>
            <textarea
              {...register("description")}
              rows={3}
              className="focus-ring w-full resize-none rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm outline-none"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category" error={errors.category?.message}>
              <select
                {...register("category")}
                className="focus-ring h-10 w-full rounded-xl border border-border bg-surface-2 px-3 text-sm outline-none"
              >
                {FOOD_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Price (USD)" error={errors.price?.message}>
              <input
                {...register("price")}
                type="number"
                step="0.01"
                className="numeric focus-ring h-10 w-full rounded-xl border border-border bg-surface-2 px-3 text-sm outline-none"
              />
            </Field>
          </div>

          <Field label="Image URL" error={errors.imageUrl?.message}>
            <input
              {...register("imageUrl")}
              className="focus-ring h-10 w-full rounded-xl border border-border bg-surface-2 px-3 text-sm outline-none"
            />
          </Field>

          <label className="flex items-center justify-between rounded-xl border border-border bg-surface-2 px-3 py-2.5">
            <span className="text-sm">Available on the menu</span>
            <Switch
              checked={Boolean(available)}
              onCheckedChange={(checked) => setValue("available", checked)}
            />
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="focus-ring h-10 rounded-xl border border-border px-4 text-sm font-medium transition-colors hover:bg-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              {food ? "Save changes" : "Add dish"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
