"use client";

import axiosInstance from "@/lib/axiosInstance";

// Customer Category Endpoints
const CUSTOMER_CATEGORIES_PATH = "/api/v1/teams/customers/categories-subcategories";
const CUSTOMER_SUBCATEGORIES_STATUS_PATH = (id: string) => `/api/v1/teams/customers/subcategories/${id}/status`;
const SYNC_PROFESSIONALS_PATH = (id: string) => `/api/v1/teams/customers/subcategories/${id}/sync-professionals`;

// Professional Category Endpoints
const PROFESSIONAL_CATEGORIES_PATH = "/api/v1/teams/professionals/get_categories_with_subcategories";
const PROFESSIONAL_SUBCATEGORIES_STATUS_PATH = (id: string) => `/api/v1/teams/professionals/subcategories/${id}/status`;
const SYNC_CUSTOMERS_PATH = (id: string) => `/api/v1/teams/professionals/subcategories/${id}/sync-customers`;

// Create category/subcategory paths
const CREATE_CUSTOMER_CATEGORY_PATH = "/api/v1/teams/customers";
const CREATE_PROFESSIONAL_CATEGORY_PATH = "/api/v1/teams/professionals";
const CREATE_CUSTOMER_SUBCATEGORY_PATH = "/api/v1/teams/customers/subcategories";
const CREATE_PROFESSIONAL_SUBCATEGORY_PATH = "/api/v1/teams/professionals/subcategories";


export async function fetchCustomerCategories() {
  const response = await axiosInstance.get(CUSTOMER_CATEGORIES_PATH);
  return response.data?.data || [];
}

export async function fetchProfessionalCategories() {
  const response = await axiosInstance.get(PROFESSIONAL_CATEGORIES_PATH);
  return response.data?.data || [];
}

export async function toggleCustomerSubcategoryStatus(id: string, isActive: boolean) {
  const response = await axiosInstance.patch(CUSTOMER_SUBCATEGORIES_STATUS_PATH(id), { is_active: isActive });
  return response.data;
}

export async function toggleProfessionalSubcategoryStatus(id: string, isActive: boolean) {
  const response = await axiosInstance.patch(PROFESSIONAL_SUBCATEGORIES_STATUS_PATH(id), { is_active: isActive });
  return response.data;
}

export async function syncProfessionalSubcategories(customerSubcategoryId: string, professionalSubcategoryIds: string[]) {
  const response = await axiosInstance.post(SYNC_PROFESSIONALS_PATH(customerSubcategoryId), {
    professional_subcategory_ids: professionalSubcategoryIds,
  });
  return response.data;
}

export async function syncCustomerSubcategories(professionalSubcategoryId: string, customerSubcategoryIds: string[]) {
  const response = await axiosInstance.post(SYNC_CUSTOMERS_PATH(professionalSubcategoryId), {
    customer_subcategory_ids: customerSubcategoryIds,
  });
  return response.data;
}

export async function createCustomerSubcategory(categoryId: string, name: string) {
  const response = await axiosInstance.post(CREATE_CUSTOMER_SUBCATEGORY_PATH, {
    category_id: categoryId,
    name: name,
  });
  return response.data;
}

export async function createProfessionalSubcategory(categoryId: string, name: string) {
  const response = await axiosInstance.post(CREATE_PROFESSIONAL_SUBCATEGORY_PATH, {
    category_id: categoryId,
    name: name,
  });
  return response.data;
}

export async function createCustomerCategory(name: string) {
  const response = await axiosInstance.post(CREATE_CUSTOMER_CATEGORY_PATH, { name });
  return response.data;
}

export async function createProfessionalCategory(name: string) {
  const response = await axiosInstance.post(CREATE_PROFESSIONAL_CATEGORY_PATH, { name });
  return response.data;
}
