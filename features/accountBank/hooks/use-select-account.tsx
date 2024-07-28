"use client";
import { AccountBank } from "@prisma/client";
import { useRef, useState } from "react";

import { Select } from "@/components/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useCreateAccountBank from "@/features/accountBank/api/use-create-account";
import useGetAccountsBank from "@/features/accountBank/api/use-get-accounts";

export const useSelectAccount = (): [
  () => JSX.Element,
  () => Promise<unknown>
] => {
  const accountQuery = useGetAccountsBank();
  const accountMutation = useCreateAccountBank();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });
  const accountOptions = (accountQuery.data ?? []).map(
    (accountBank: AccountBank) => ({
      value: accountBank.id,
      label: accountBank.name,
    })
  );
  const [promise, setPromise] = useState<{
    resolve: (value: string | undefined) => void;
  } | null>(null);
  const selectValue = useRef<string>();

  const confirm = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    if (promise) {
      promise.resolve(selectValue.current);
      handleClose();
    }
  };

  const handleCancel = () => {
    if (promise) {
      promise.resolve(undefined);
      handleClose();
    }
  };

  const ConfirmationDialog = () => {
    return (
      <Dialog open={!!promise} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select an account</DialogTitle>
            <DialogDescription>
              Please select an account to continue
            </DialogDescription>
          </DialogHeader>
          <Select
            placeholder="Select an account"
            options={accountOptions}
            onChange={(value) => (selectValue.current = value)}
            onCreate={onCreateAccount}
            disabled={accountQuery.isLoading || accountMutation.isPending}
          />
          <DialogFooter className="pt-2">
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return [ConfirmationDialog, confirm];
};
