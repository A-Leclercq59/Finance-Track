"use client";

import { useMountedState } from "react-use";

import { EditAccountSheet } from "@/features/accountBank/components/edit-account-sheet";
import { NewAccountSheet } from "@/features/accountBank/components/new-account-sheet";
import { EditCategorySheet } from "@/features/categorie/components/edit-categorie";
import { NewCategorySheet } from "@/features/categorie/components/new-categorie-sheet";

export const SheetProvider = () => {
  const isMounted = useMountedState();

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
      <NewCategorySheet />
      <EditCategorySheet />
    </>
  );
};
