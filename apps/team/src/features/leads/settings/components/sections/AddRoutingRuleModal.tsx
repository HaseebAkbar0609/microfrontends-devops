import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface AddRoutingRuleModalProps {
  onAdd: (name: string, description: string) => void;
  isLoading: boolean;
}

export function AddRoutingRuleModal({ onAdd, isLoading }: AddRoutingRuleModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), description.trim());
    setOpen(false);
    setName("");
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-10 gap-2 border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add Routing Rule
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-500">
              Rule Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priority Leads"
              className="border-slate-900 text-slate-900"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-500">
              Description
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              className="border-slate-900 text-slate-900"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-slate-200"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="bg-slate-900 text-white hover:bg-slate-800"
            onClick={handleAdd}
            disabled={!name.trim() || isLoading}
          >
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
