"use client";

// LOCAL DEV — no Supabase. Everyone is superadmin so all pages open.
export function useRole() {
  return {
    role: "superadmin",
    loading: false,
    isAdmin: true,
    canEdit: true,
    canEditProtected: true,
  };
}