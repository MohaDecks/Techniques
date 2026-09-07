"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useStore } from "@farsamo/core";
import type { Category, CategoryInput } from "@farsamo/core";

const emptyCategory: CategoryInput = {
  name: "",
  description: "",
  icon: "House",
  color: "#2563EB",
  isEnabled: true,
};

export default function AdminCategoriesPage() {
  const { categories, upsertCategory, deleteCategory } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryInput>(emptyCategory);
  const [removeId, setRemoveId] = useState<string | null>(null);

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Control which service groups appear in the customer app."
        actions={
          <Button
            className="rounded-xl"
            onClick={() => {
              setEditing(null);
              setForm(emptyCategory);
              setOpen(true);
            }}
          >
            Add Category
          </Button>
        }
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <div key={category.id} className="app-card flex items-center gap-3 p-4">
            <div className="size-12 rounded-2xl" style={{ backgroundColor: category.color }} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-navy">{category.name}</p>
              <p className="truncate text-xs text-muted-foreground">{category.description}</p>
            </div>
            <Switch checked={category.isEnabled} onCheckedChange={(checked) => upsertCategory({ ...category, isEnabled: checked }, category.id)} />
            <Button
              size="xs"
              variant="outline"
              onClick={() => {
                setEditing(category);
                setForm(category);
                setOpen(true);
              }}
            >
              Edit
            </Button>
            <Button size="xs" variant="destructive" onClick={() => setRemoveId(category.id)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit category" : "Add category"}</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              upsertCategory(form, editing?.id);
              setOpen(false);
            }}
          >
            <div className="space-y-2">
              <Label>Name</Label>
              <Input className="app-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input className="app-input" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Color</Label>
                <Input className="app-input" value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Icon</Label>
                <Input className="app-input" value={form.icon} onChange={(event) => setForm({ ...form, icon: event.target.value })} />
              </div>
            </div>
            <Button type="submit" className="w-full rounded-xl">
              Save category
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={Boolean(removeId)}
        onOpenChange={() => setRemoveId(null)}
        title="Delete category?"
        description="This category will be removed from the marketplace."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (removeId) deleteCategory(removeId);
          setRemoveId(null);
        }}
      />
    </div>
  );
}
