"use client";

import { useMountedState } from "react-use";

import { EditAccountSheet } from "@/features/accountBank/components/edit-account-sheet";
import { NewAccountSheet } from "@/features/accountBank/components/new-account-sheet";

export const SheetProvider = () => {
  const isMounted = useMountedState();

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
    </>
  );
};
