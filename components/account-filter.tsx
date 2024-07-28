"use client";

import { useGetAccountsBank } from "@/features/accountBank/api/use-get-accounts";
import useGetSummary from "@/features/summary/api/use-get-summary";
import { AccountBank } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const AccountFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const accountBankId = params.get("accountBankId") || "all";
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const { data: accounts, isLoading: isLoadingAccounts } = useGetAccountsBank();
  const { isLoading: isLoadingSummary, refetch } = useGetSummary();

  const onChange = (newValue: string) => {
    const query = qs.stringify(
      {
        accountBankId: newValue === "all" ? "" : newValue,
        from,
        to,
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(`${pathname}?${query}`);
  };

  return (
    <Select
      value={accountBankId}
      onValueChange={onChange}
      disabled={isLoadingAccounts || isLoadingSummary}
    >
      <SelectTrigger className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition">
        <SelectValue placeholder="Filter by account" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All accounts</SelectItem>
        {accounts?.map((accountBank: AccountBank) => (
          <SelectItem key={accountBank.id} value={accountBank.id}>
            {accountBank.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default AccountFilter;
