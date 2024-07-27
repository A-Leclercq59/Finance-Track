import { Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import useCreateAccountBank from "@/features/accountBank/api/use-create-account";
import useGetAccountsBank from "@/features/accountBank/api/use-get-accounts";
import { useGetCategories } from "@/features/categorie/api";
import useCreateCategorie from "@/features/categorie/api/use-create-categorie";
import {
  useDeleteTransaction,
  useEditTransaction,
  useGetTransaction,
} from "@/features/transaction/api";
import {
  ApiValues,
  TransactionForm,
} from "@/features/transaction/components/transaction-form";
import { useOpenTransaction } from "@/features/transaction/hooks";
import { useConfirm } from "@/hooks/use-confirm";
import { AccountBank, Categorie } from "@prisma/client";

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction();
  const transactionQuery = useGetTransaction(id);
  const mutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);

  const categoriesQuery = useGetCategories();
  const categoryMutation = useCreateCategorie();
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

  const [ConfirmationDialog, confirm] = useConfirm(
    "Delete transaction",
    "Are you sure you want to delete this transaction?"
  );
  const onSubmit = (formValues: ApiValues) => {
    mutation.mutate(formValues, {
      onSuccess: () => {
        onClose();
      },
    });
  };
  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        onClose();
      },
    });
  };
  const isLoading =
    transactionQuery.isLoading ||
    accountsQuery.isLoading ||
    categoriesQuery.isLoading;
  const isPending =
    mutation.isPending ||
    deleteMutation.isPending ||
    transactionQuery.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const defaultValues = transactionQuery.data
    ? {
        accountBankId: transactionQuery.data.accountBankId,
        categorieId: transactionQuery.data.categorieId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date
          ? new Date(transactionQuery.data.date)
          : new Date(),
        notes: transactionQuery.data.notes || "",
        payee: transactionQuery.data.payee,
      }
    : {
        accountBankId: "",
        amount: "",
        date: new Date(),
        payee: "",
      };
  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit transaction</SheetTitle>
            <SheetDescription>
              Edit the name of the transaction
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="animate-spin size-6 text-slate-600" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              onSubmit={onSubmit}
              onDelete={onDelete}
              defaultValues={defaultValues}
              disabled={isPending}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
