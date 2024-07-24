"use client";

import { Button } from "@/components/ui/button";
import { useNewAccount } from "@/features/accountBank/hooks/use-new-account";

const DashboardPage = () => {
  const { onOpen } = useNewAccount();
  // const { data: accounts, isLoading } = useGetAccounts();

  // if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <Button variant="outline" color="primary" onClick={onOpen}>
        New account
      </Button>
    </div>
  );
};

export default DashboardPage;
