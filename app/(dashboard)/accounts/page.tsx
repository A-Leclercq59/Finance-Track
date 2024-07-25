"use client";
import { Loader2, Plus } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useDeleteBulkAccountBank from "@/features/accountBank/api/use-bulk-delete";
import useGetAccountsBank from "@/features/accountBank/api/use-get-accounts";
import { useNewAccount } from "@/features/accountBank/hooks/use-new-account";
import { columns } from "./columns";

const AccountsPage = () => {
  const newAccount = useNewAccount();
  const deleteAccountsBank = useDeleteBulkAccountBank();
  const accountsBankQuery = useGetAccountsBank();
  const accountsBank = accountsBankQuery.data || [];

  const isDisabled =
    deleteAccountsBank.isPending || accountsBankQuery.isLoading;

  if (accountsBankQuery.isLoading)
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Accounts page</CardTitle>
          <Button size={"sm"} onClick={newAccount.onOpen}>
            <Plus className="mr-2 size-4" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={accountsBank}
            filterKey="name"
            disabled={isDisabled}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteAccountsBank.mutate({ ids });
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsPage;
