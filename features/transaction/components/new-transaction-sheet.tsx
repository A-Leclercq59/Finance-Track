import { Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCreateAccountBank } from "@/features/accountBank/api/use-create-account";
import { useGetAccountsBank } from "@/features/accountBank/api/use-get-accounts";
import { useCreateCategory, useGetCategories } from "@/features/categorie/api";
import { useCreateTransaction } from "@/features/transaction/api";
import {
  ApiValues,
  TransactionForm,
} from "@/features/transaction/components/transaction-form";
import { useNewTransaction } from "@/features/transaction/hooks";
import { AccountBank, Categorie } from "@prisma/client";

export const NewTransactionSheet = () => {
  const { isOpen, onClose } = useNewTransaction();
  const mutation = useCreateTransaction();
  const categoriesQuery = useGetCategories();
  const categoryMutation = useCreateCategory();

  const onCreateCategory = (name: string) => categoryMutation.mutate({ name });
  const categoryOptions = (categoriesQuery.data ?? []).map(
    (categorie: Categorie) => ({
      label: categorie.name,
      value: categorie.id,
    })
  );

  const accountsQuery = useGetAccountsBank();
  const accountMutation = useCreateAccountBank();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });
  const accountOptions = (accountsQuery.data ?? []).map(
    (accountBank: AccountBank) => ({
      label: accountBank.name,
      value: accountBank.id,
    })
  );

  const isPending =
    mutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;
  const isLoading = categoriesQuery.isLoading || accountsQuery.isLoading;
  const onSubmit = (formValues: ApiValues) => {
    mutation.mutate(formValues, {
      onSuccess: () => {
        onClose();
      },
    });
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Add a new transaction</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={onSubmit}
            disabled={isPending}
            categoryOptions={categoryOptions}
            onCreateCategory={onCreateCategory}
            accountOptions={accountOptions}
            onCreateAccount={onCreateAccount}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
