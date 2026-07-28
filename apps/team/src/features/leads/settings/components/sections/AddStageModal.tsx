import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { createStage } from "@/features/leads/settings/api/pipelineApi";
import type { StageMode } from "@/features/leads/settings/types/pipelineApi";
import { showToast } from "@/lib/toast";

interface AddStageModalProps {
  pipelineId: string;
}

export function AddStageModal({ pipelineId }: AddStageModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [mode, setMode] = useState<StageMode>("manual");
  
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      return createStage(pipelineId, { name, mode });
    },
    onSuccess: () => {
      showToast("success", "Stage created successfully");
      queryClient.invalidateQueries({ queryKey: ["pipelines"] });
      setOpen(false);
      setName("");
      setMode("manual");
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create stage";
      showToast("error", msg);
    },
  });

  const handleSave = () => {
    if (!name.trim()) {
      showToast("error", "Stage name is required");
      return;
    }
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full border-dashed">
          + Add Stage
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Stage</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-slate-900">
              Stage Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g. Follow Up"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-slate-900 focus-visible:ring-slate-900"
            />
          </div>
          
          <div className="space-y-3 pt-2">
            <Label className="text-sm font-semibold text-slate-900">Mode</Label>
            <RadioGroup
              value={mode}
              onValueChange={(value) => setMode(value as StageMode)}
              className="flex gap-6"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem
                  value="automatic"
                  className="text-slate-900 data-[state=checked]:border-slate-900"
                />
                <span className="text-sm text-slate-700">Automatic</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem
                  value="manual"
                  className="text-slate-900 data-[state=checked]:border-slate-900"
                />
                <span className="text-sm text-slate-700">Manual</span>
              </label>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
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
            {mutation.isPending ? "Saving..." : "Create Stage"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
