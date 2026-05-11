"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import { getCategoriesAction, type Category } from "@/api-actions";
import { formatOptions } from "@/lib/utils";
import { FormSelect } from "./FormSelect";

const CATEGORIES_PAGE_SIZE = 50;

export interface FormCategorySelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  label?: React.ReactNode;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
}

export function FormCategorySelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  placeholder,
  className,
  triggerClassName,
  disabled,
}: FormCategorySelectProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [isLoadingMoreCategories, setIsLoadingMoreCategories] = useState(false);
  const [categoriesHasMore, setCategoriesHasMore] = useState(false);
  const [categoryPage, setCategoryPage] = useState(1);
  
  const categoriesRef = useRef<Category[]>([]);
  const categoriesLoadingMoreRef = useRef(false);

  useEffect(() => {
    categoriesRef.current = categories;
  }, [categories]);

  const loadInitialCategories = useCallback(async () => {
    setIsCategoriesLoading(true);
    try {
      const result = await getCategoriesAction({
        page: 1,
        limit: CATEGORIES_PAGE_SIZE,
      });
      
      if (!result.success || !result.data) {
        setCategories([]);
        categoriesRef.current = [];
        setCategoriesHasMore(false);
        return;
      }
      
      const { items, page, total } = result.data;
      setCategories(items);
      categoriesRef.current = items;
      setCategoryPage(page);
      
      if (total !== null) {
        setCategoriesHasMore(items.length < total);
      } else {
        setCategoriesHasMore(items.length === CATEGORIES_PAGE_SIZE);
      }
    } finally {
      setIsCategoriesLoading(false);
    }
  }, []);

  const loadMoreCategories = useCallback(async () => {
    if (
      !categoriesHasMore ||
      isCategoriesLoading ||
      isLoadingMoreCategories ||
      categoriesLoadingMoreRef.current
    ) {
      return;
    }

    categoriesLoadingMoreRef.current = true;
    setIsLoadingMoreCategories(true);
    
    try {
      const nextPage = categoryPage + 1;
      const result = await getCategoriesAction({
        page: nextPage,
        limit: CATEGORIES_PAGE_SIZE,
      });

      if (!result.success || !result.data) {
        setCategoriesHasMore(false);
        return;
      }

      const { items, page, total } = result.data;
      if (items.length === 0) {
        setCategoriesHasMore(false);
        return;
      }

      const prev = categoriesRef.current;
      const seen = new Set(prev.map((c) => c.id));
      const merged = [...prev];
      for (const c of items) {
        if (!seen.has(c.id)) {
          seen.add(c.id);
          merged.push(c);
        }
      }

      if (merged.length === prev.length) {
        setCategoriesHasMore(false);
        return;
      }

      categoriesRef.current = merged;
      setCategories(merged);
      setCategoryPage(page);
      
      if (total !== null) {
        setCategoriesHasMore(merged.length < total);
      } else {
        setCategoriesHasMore(items.length === CATEGORIES_PAGE_SIZE);
      }
    } finally {
      categoriesLoadingMoreRef.current = false;
      setIsLoadingMoreCategories(false);
    }
  }, [categoriesHasMore, categoryPage, isCategoriesLoading, isLoadingMoreCategories]);

  useEffect(() => {
    loadInitialCategories();
  }, [loadInitialCategories]);

  /** Auto-load second page if the first load was too short to fill the scroll container. */
  useEffect(() => {
    if (
      categories.length > 0 &&
      categories.length < 15 &&
      categoriesHasMore &&
      !isCategoriesLoading &&
      !isLoadingMoreCategories
    ) {
      loadMoreCategories();
    }
  }, [categories.length, categoriesHasMore, isCategoriesLoading, isLoadingMoreCategories, loadMoreCategories]);

  const categoryOptions = formatOptions(categories);

  return (
    <FormSelect
      control={control}
      name={name}
      label={label}
      placeholder={placeholder}
      options={categoryOptions}
      disabled={disabled || (isCategoriesLoading && categories.length === 0)}
      className={className}
      triggerClassName={triggerClassName}
      hasMore={categoriesHasMore}
      isLoadingMore={isLoadingMoreCategories}
      onLoadMore={loadMoreCategories}
    />
  );
}
