"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, ChevronDown, ArrowLeftRight, CirclePlus, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Translate } from "@/utils/translation/translate";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ToggleSwitch } from "@/features/leads/settings/components/common/ToggleSwitch";
import { AddCategoryModal } from "@/features/leads/settings/components/AddCategoryModal";
import { AddGroupModal } from "./AddGroupModal";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import type { CategoryGroup, SubCategory } from "@/features/leads/settings/types";
import {
  fetchCustomerCategories,
  fetchProfessionalCategories,
  toggleCustomerSubcategoryStatus,
  toggleProfessionalSubcategoryStatus,
  syncProfessionalSubcategories,
  syncCustomerSubcategories,
  createCustomerSubcategory,
  createProfessionalSubcategory,
} from "@/features/leads/settings/api/categoriesApi";

type ModalTarget =
  | { panel: "customers" | "professionals"; groupId: string; subCatId?: string; initialTags: string[] }
  | null;

// ─── Sub-category row ──────────────────────────────────────────────────────────

function SubCategoryRow({
  subCat,
  isOpen,
  onToggleOpen,
  onToggleActive,
  onRemoveTag,
  onAddTag,
}: {
  subCat: SubCategory;
  isOpen: boolean;
  onToggleOpen: () => void;
  onToggleActive: (next: boolean) => void;
  onRemoveTag: (tag: string) => void;
  onAddTag: () => void;
}) {
  return (
    <div className="border-b border-slate-200 last:border-b-0 px-4">
      <div className="flex items-center gap-3 py-3">
        <ToggleSwitch checked={subCat.isActive} onChange={onToggleActive} />
        <div className="flex-1 min-w-0">
          <div className="text-base font-medium text-[#0F172B] truncate">{subCat.name}</div>
          <div className="text-sm text-[#45556C]">
            <Translate text={localizationConstants.activeLabel} />
          </div>
        </div>
        <span className="flex-shrink-0 rounded px-2 py-0.5 bg-gray-100 text-sm font-medium text-gray-500">
          {String(subCat.count).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={onToggleOpen}
          className="flex-shrink-0 text-slate-400 hover:text-slate-600"
        >
          <ChevronDown
            className={cn("h-5 w-5 transition-transform", isOpen && "rotate-180")}
          />
        </button>
      </div>

      {isOpen && (
        <div className="flex flex-wrap gap-2 pb-6">
          {subCat.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-0.5 rounded-md bg-zinc-100 py-1 pl-2 pr-1"
            >
              <span className="text-xs font-medium text-[#09090B]">{tag}</span>
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="flex items-center justify-center rounded p-0.5 hover:bg-zinc-200"
              >
                <X className="h-3 w-3 text-[#09090B]" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={onAddTag}
            className="flex items-center gap-1 rounded-md border border-dashed border-neutral-300 bg-zinc-100 py-1 pl-3 pr-2 text-xs font-medium text-[#666666] hover:bg-zinc-200"
          >
            <CirclePlus className="h-4 w-4" />
            <Translate text={localizationConstants.addLabel} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Category group card ───────────────────────────────────────────────────────

function CategoryGroupCard({
  group,
  isOpen,
  openSubCats,
  onToggleGroup,
  onToggleSubCat,
  onToggleSubCatActive,
  onRemoveTag,
  onAddTagModal,
  onAddSubCategory,
}: {
  group: CategoryGroup;
  isOpen: boolean;
  openSubCats: Set<string>;
  onToggleGroup: () => void;
  onToggleSubCat: (id: string) => void;
  onToggleSubCatActive: (subId: string, next: boolean) => void;
  onRemoveTag: (subId: string, tag: string) => void;
  onAddTagModal: (subId: string, currentTags: string[]) => void;
  onAddSubCategory: () => void;
}) {
  return (
    <div className="border-b border-slate-200 last:border-b-0">
      {/* Group header */}
      <button
        type="button"
        onClick={onToggleGroup}
        className="flex w-full items-center justify-between bg-slate-100 px-4 py-4 text-left hover:bg-slate-200/60 transition-colors"
      >
        <span className="text-base font-medium text-[#0F172B]">{group.name}</span>
        <div className="flex items-center gap-2">
          <span className="rounded px-2 py-0.5 bg-blue-200 text-sm font-medium text-blue-700">
            {group.subCategories.length || 10}
          </span>
          <ChevronDown
            className={cn("h-5 w-5 text-slate-600 transition-transform", isOpen && "rotate-180")}
          />
        </div>
      </button>

      {/* Group body */}
      {isOpen && (
        <div>
          {group.subCategories.map((subCat) => (
            <SubCategoryRow
              key={subCat.id}
              subCat={subCat}
              isOpen={openSubCats.has(subCat.id)}
              onToggleOpen={() => onToggleSubCat(subCat.id)}
              onToggleActive={(next) => onToggleSubCatActive(subCat.id, next)}
              onRemoveTag={(tag) => onRemoveTag(subCat.id, tag)}
              onAddTag={() => onAddTagModal(subCat.id, subCat.tags)}
            />
          ))}
          <div className="p-4">
            <button
              type="button"
              onClick={onAddSubCategory}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#D1D5DB] bg-slate-200/30 py-3.5 text-sm font-medium text-[#666666] hover:bg-slate-200/50 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <Translate text={localizationConstants.addNewSubCategoryTitle} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Panel ─────────────────────────────────────────────────────────────────────

function CategoryPanel({
  titleKey,
  groups,
  openGroups,
  openSubCats,
  onToggleGroup,
  onToggleSubCat,
  onToggleSubCatActive,
  onRemoveTag,
  onAddTagModal,
  onAddSubCategory,
  onAddGroup,
  borderClassName,
}: {
  titleKey: typeof localizationConstants.customersColumnTitle;
  groups: CategoryGroup[];
  openGroups: Set<string>;
  openSubCats: Set<string>;
  onToggleGroup: (id: string) => void;
  onToggleSubCat: (id: string) => void;
  onToggleSubCatActive: (groupId: string, subId: string, next: boolean) => void;
  onRemoveTag: (groupId: string, subId: string, tag: string) => void;
  onAddTagModal: (groupId: string, subId: string, currentTags: string[]) => void;
  onAddSubCategory: (groupId: string) => void;
  onAddGroup: () => void;
  borderClassName: string;
}) {
  const total = groups.length;

  return (
    <div className={cn("flex flex-1 flex-col overflow-hidden border border-slate-200 bg-white", borderClassName)}>
      {/* Panel header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-[#0F172B]">
            <Translate text={titleKey} />
          </h2>
          <span className="text-sm text-[#45556C]">(Total {total})</span>
        </div>
        <Button
          size="sm"
          onClick={onAddGroup}
          className="flex items-center gap-2 bg-[#111721] text-white hover:bg-[#111721]/90 rounded-[10px] h-9 px-4"
        >
          <Plus className="h-4 w-4" />
          <Translate text={localizationConstants.addGroupLabel} />
        </Button>
      </div>

      {/* Groups */}
      {groups.map((group) => (
        <CategoryGroupCard
          key={group.id}
          group={group}
          isOpen={openGroups.has(group.id)}
          openSubCats={openSubCats}
          onToggleGroup={() => onToggleGroup(group.id)}
          onToggleSubCat={onToggleSubCat}
          onToggleSubCatActive={(subId, next) => onToggleSubCatActive(group.id, subId, next)}
          onRemoveTag={(subId, tag) => onRemoveTag(group.id, subId, tag)}
          onAddTagModal={(subId, currentTags) => onAddTagModal(group.id, subId, currentTags)}
          onAddSubCategory={() => onAddSubCategory(group.id)}
        />
      ))}
    </div>
  );
}

// ─── Main section ──────────────────────────────────────────────────────────────

function mapApiToCategoryGroups(apiData: Record<string, unknown>[]): CategoryGroup[] {
  if (!Array.isArray(apiData)) return [];
  return apiData.map((group: Record<string, unknown>) => ({
    id: group.id as string,
    name: group.name as string,
    subCategories: ((group.subcategories as Record<string, unknown>[]) || []).map((sub: Record<string, unknown>) => ({
      id: sub.id as string,
      name: sub.name as string,
      isActive: (sub.is_active as boolean) ?? true,
      count: ((sub.mapped_categories as Record<string, unknown>[]) || []).length,
      tags: ((sub.mapped_categories as Record<string, unknown>[]) || []).map((m: Record<string, unknown>) => m.name as string),
    })),
  }));
}

export function CategoriesSection() {
  const queryClient = useQueryClient();

  const { data: customerApiData } = useQuery({
    queryKey: ["customer-categories"],
    queryFn: fetchCustomerCategories,
  });

  const { data: professionalApiData } = useQuery({
    queryKey: ["professional-categories"],
    queryFn: fetchProfessionalCategories,
  });

  const customers = useMemo(() => mapApiToCategoryGroups(customerApiData || []), [customerApiData]);
  const professionals = useMemo(() => mapApiToCategoryGroups(professionalApiData || []), [professionalApiData]);

  // Expand the first group by default if it exists
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  const [openSubCats, setOpenSubCats] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<ModalTarget>(null);
  const [groupModalPanel, setGroupModalPanel] = useState<"customers" | "professionals" | null>(null);

  // Initialize open groups once data loads
  useEffect(() => {
    if (customers.length > 0 && openGroups.size === 0) {
      setOpenGroups(new Set([customers[0].id]));
    }
  }, [customers, openGroups.size]);

  const toggleGroup = (id: string) =>
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleSubCat = (id: string) =>
    setOpenSubCats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleCustomerMutation = useMutation({
    mutationFn: (data: { id: string; next: boolean }) => toggleCustomerSubcategoryStatus(data.id, data.next),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customer-categories"] })
  });

  const toggleProfessionalMutation = useMutation({
    mutationFn: (data: { id: string; next: boolean }) => toggleProfessionalSubcategoryStatus(data.id, data.next),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["professional-categories"] })
  });

  const syncCustomerMutation = useMutation({
    mutationFn: (data: { professionalSubcategoryId: string; customerSubcategoryIds: string[] }) => 
      syncCustomerSubcategories(data.professionalSubcategoryId, data.customerSubcategoryIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professional-categories"] });
      showToast("success", "Tags updated successfully");
    }
  });

  const syncProfessionalMutation = useMutation({
    mutationFn: (data: { customerSubcategoryId: string; professionalSubcategoryIds: string[] }) => 
      syncProfessionalSubcategories(data.customerSubcategoryId, data.professionalSubcategoryIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-categories"] });
      showToast("success", "Tags updated successfully");
    }
  });

  const createCustomerSubMutation = useMutation({
    mutationFn: (data: { categoryId: string; name: string }) => createCustomerSubcategory(data.categoryId, data.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-categories"] });
      showToast("success", "Subcategory created successfully");
    }
  });

  const createProfessionalSubMutation = useMutation({
    mutationFn: (data: { categoryId: string; name: string }) => createProfessionalSubcategory(data.categoryId, data.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professional-categories"] });
      showToast("success", "Subcategory created successfully");
    }
  });

  const toggleSubCatActive = (
    panel: "customers" | "professionals",
    groupId: string,
    subId: string,
    next: boolean
  ) => {
    if (panel === "customers") toggleCustomerMutation.mutate({ id: subId, next });
    else toggleProfessionalMutation.mutate({ id: subId, next });
  };

  const removeTag = (
    panel: "customers" | "professionals",
    groupId: string,
    subId: string,
    tag: string
  ) => {
    // When removing a tag, we just need to get the current tags, filter out this one, 
    // and sync the remaining ones.
    const group = (panel === "customers" ? customers : professionals).find(g => g.id === groupId);
    const sub = group?.subCategories.find(s => s.id === subId);
    if (!sub) return;
    
    const remainingTags = sub.tags.filter(t => t !== tag);
    saveModalTagsForSubcategory(panel, subId, remainingTags);
  };

  const saveModalTagsForSubcategory = (panel: "customers" | "professionals", subCatId: string, tagNames: string[]) => {
    const oppositeApiData = panel === "customers" ? professionalApiData : customerApiData;
    
    // Resolve names to UUIDs on the opposite panel
    const targetIds: string[] = [];
    const missingTags: string[] = [];
    
    for (const tagName of tagNames) {
      const cleanName = tagName.trim();
      if (!cleanName) continue;
      
      let foundId = null;
      for (const group of (oppositeApiData || [])) {
        const match = (group.subcategories || []).find((s: Record<string, unknown>) => (s.name as string).toLowerCase() === cleanName.toLowerCase());
        if (match) {
          foundId = match.id;
          break;
        }
      }
      
      if (foundId) {
        targetIds.push(foundId);
      } else {
        missingTags.push(cleanName);
      }
    }
    
    if (missingTags.length > 0) {
      showToast("error", `Could not add tags: ${missingTags.join(", ")}. They must exactly match an existing Subcategory (not a Group) on the other panel.`);
      return; // Stop execution, do not sync or show success message
    }
    
    if (panel === "customers") {
      syncProfessionalMutation.mutate({ customerSubcategoryId: subCatId, professionalSubcategoryIds: targetIds });
    } else {
      syncCustomerMutation.mutate({ professionalSubcategoryId: subCatId, customerSubcategoryIds: targetIds });
    }
  };

  const saveModalTags = (savedTags: string[]) => {
    if (!modal) return;
    const { panel, groupId, subCatId } = modal;

    if (subCatId) {
      saveModalTagsForSubcategory(panel, subCatId, savedTags);
    } else {
      // Adding new sub-categories to a group
      for (const name of savedTags) {
        if (panel === "customers") {
          createCustomerSubMutation.mutate({ categoryId: groupId, name });
        } else {
          createProfessionalSubMutation.mutate({ categoryId: groupId, name });
        }
      }
    }
  };

  return (
    <div className="mb-10">
      <div className="flex items-stretch">
        {/* Customers panel */}
        <CategoryPanel
          titleKey={localizationConstants.customersColumnTitle}
          groups={customers}
          openGroups={openGroups}
          openSubCats={openSubCats}
          onToggleGroup={toggleGroup}
          onToggleSubCat={toggleSubCat}
          onToggleSubCatActive={(groupId, subId, next) =>
            toggleSubCatActive("customers", groupId, subId, next)
          }
          onRemoveTag={(groupId, subId, tag) =>
            removeTag("customers", groupId, subId, tag)
          }
          onAddTagModal={(groupId, subId, currentTags) =>
            setModal({ panel: "customers", groupId, subCatId: subId, initialTags: currentTags })
          }
          onAddSubCategory={(groupId) =>
            setModal({ panel: "customers", groupId, initialTags: [] })
          }
          onAddGroup={() => setGroupModalPanel("customers")}
          borderClassName="rounded-[10px_0px_10px_10px]"
        />

        {/* Divider */}
        <div className="flex w-16 flex-shrink-0 flex-col items-center justify-start border-t border-slate-200 bg-white pt-8">
          <ArrowLeftRight className="h-7 w-7 text-slate-800" />
        </div>

        {/* Professionals panel */}
        <CategoryPanel
          titleKey={localizationConstants.professionalsColumnTitle}
          groups={professionals}
          openGroups={openGroups}
          openSubCats={openSubCats}
          onToggleGroup={toggleGroup}
          onToggleSubCat={toggleSubCat}
          onToggleSubCatActive={(groupId, subId, next) =>
            toggleSubCatActive("professionals", groupId, subId, next)
          }
          onRemoveTag={(groupId, subId, tag) =>
            removeTag("professionals", groupId, subId, tag)
          }
          onAddTagModal={(groupId, subId, currentTags) =>
            setModal({ panel: "professionals", groupId, subCatId: subId, initialTags: currentTags })
          }
          onAddSubCategory={(groupId) =>
            setModal({ panel: "professionals", groupId, initialTags: [] })
          }
          onAddGroup={() => setGroupModalPanel("professionals")}
          borderClassName="rounded-[0px_10px_10px_10px]"
        />
      </div>

      {/* Add (sub-)category modal */}
      <AddCategoryModal
        open={modal !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setModal(null);
        }}
        initialTags={modal?.initialTags ?? []}
        onSave={saveModalTags}
      />

      {/* Add Group Modal */}
      <AddGroupModal
        open={groupModalPanel !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setGroupModalPanel(null);
        }}
        panel={groupModalPanel}
      />
    </div>
  );
}