import { redirect } from "next/navigation";

import { UserButton } from "@/components/auth/user-button";
import { currentUser } from "@/lib/auth/helper";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const user = await currentUser();

  if (!user) redirect("/auth/login");

  return (
    <div>
      {children}
      <UserButton />
    </div>
  );
};

export default ProtectedLayout;
