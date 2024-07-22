"use client";

import { AccountBank } from "@prisma/client";

import useGetAccountsBank from "@/features/accountBank/api/use-get-accounts";

const DashboardPage = () => {
  const { data: accountsBank, isLoading } = useGetAccountsBank();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {accountsBank?.map((accountBank: AccountBank) => (
        <div key={accountBank.id}>{accountBank.name}</div>
      ))}
    </div>
  );
};

export default DashboardPage;
