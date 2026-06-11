"use client";

import { useState } from "react";
import { Plus, ChevronDown, ArrowLeftRight, CirclePlus, X } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ToggleSwitch } from "@/features/leads/settings/components/common/ToggleSwitch";
import { AddCategoryModal } from "@/features/leads/settings/components/AddCategoryModal";
import localizationConstants from "@/utils/translation/constants";
import {
  customerCategoryGroups,
  professionalCategoryGroups,
} from "@/features/leads/settings/constants";
import type { CategoryGroup, SubCategory } from "@/features/leads/settings/types";

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
  const total = groups.reduce((sum, g) => sum + g.subCategories.length, 0);

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

export function CategoriesSection() {
  const [customers, setCustomers] = useState<CategoryGroup[]>(customerCategoryGroups);
  const [professionals, setProfessionals] = useState<CategoryGroup[]>(professionalCategoryGroups);
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    new Set(["renovation", "construction"])
  );
  const [openSubCats, setOpenSubCats] = useState<Set<string>>(
    new Set(["bathroom", "carpentry"])
  );
  const [modal, setModal] = useState<ModalTarget>(null);

  const toggleGroup = (id: string) =>
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleSubCat = (id: string) =>
    setOpenSubCats((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const getSetterFor = (panel: "customers" | "professionals") =>
    panel === "customers" ? setCustomers : setProfessionals;

  const toggleSubCatActive = (
    panel: "customers" | "professionals",
    groupId: string,
    subId: string,
    next: boolean
  ) =>
    getSetterFor(panel)((prev) =>
      prev.map((g) =>
        g.id !== groupId
          ? g
          : {
              ...g,
              subCategories: g.subCategories.map((s) =>
                s.id !== subId ? s : { ...s, isActive: next }
              ),
            }
      )
    );

  const removeTag = (
    panel: "customers" | "professionals",
    groupId: string,
    subId: string,
    tag: string
  ) =>
    getSetterFor(panel)((prev) =>
      prev.map((g) =>
        g.id !== groupId
          ? g
          : {
              ...g,
              subCategories: g.subCategories.map((s) =>
                s.id !== subId ? s : { ...s, tags: s.tags.filter((t) => t !== tag) }
              ),
            }
      )
    );

  const saveModalTags = (savedTags: string[]) => {
    if (!modal) return;
    const { panel, groupId, subCatId } = modal;

    if (subCatId) {
      // Updating tags for an existing sub-category
      getSetterFor(panel)((prev) =>
        prev.map((g) =>
          g.id !== groupId
            ? g
            : {
                ...g,
                subCategories: g.subCategories.map((s) =>
                  s.id !== subCatId ? s : { ...s, tags: savedTags }
                ),
              }
        )
      );
    } else {
      // Adding new sub-categories to a group
      getSetterFor(panel)((prev) =>
        prev.map((g) =>
          g.id !== groupId
            ? g
            : {
                ...g,
                subCategories: [
                  ...g.subCategories,
                  ...savedTags.map((name, i) => ({
                    id: `${groupId}-${Date.now()}-${i}`,
                    name,
                    isActive: true,
                    count: 0,
                    tags: [],
                  })),
                ],
              }
        )
      );
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
          onAddGroup={() => {}}
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
          onAddGroup={() => {}}
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
    </div>
  );
}
