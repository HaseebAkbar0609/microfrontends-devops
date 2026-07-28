import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCustomerCategory, createProfessionalCategory } from "@/features/leads/settings/api/categoriesApi";
import { showToast } from "@/lib/toast";

interface AddGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  panel: "customers" | "professionals" | null;
}

export function AddGroupModal({ open, onOpenChange, panel }: AddGroupModalProps) {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (panel === "customers") {
        return createCustomerCategory(name);
      } else if (panel === "professionals") {
        return createProfessionalCategory(name);
      }
      throw new Error("Invalid panel");
    },
    onSuccess: () => {
      showToast("success", "Group created successfully");
      if (panel === "customers") {
        queryClient.invalidateQueries({ queryKey: ["customer-categories"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["professional-categories"] });
      }
      onOpenChange(false);
      setName("");
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create group";
      showToast("error", msg);
    },
  });

  const handleSave = () => {
    if (!name.trim()) {
      showToast("error", "Group name is required");
      return;
    }
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New {panel === "customers" ? "Customer" : "Professional"} Group</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="group-name" className="text-sm font-semibold text-slate-900">
              Group Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="group-name"
              placeholder="e.g. Landscaping"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-slate-900 focus-visible:ring-slate-900"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
            className="border-slate-900 text-slate-900"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={mutation.isPending}
            className="bg-slate-900 text-white hover:bg-slate-800"
          >
            {mutation.isPending ? "Saving..." : "Create Group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
