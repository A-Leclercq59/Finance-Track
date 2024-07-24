import { redirect } from "next/navigation";

import { Header } from "@/components/header/header";
import { currentUser } from "@/lib/auth/helper";

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = async ({ children }: Props) => {
  const user = await currentUser();

  if (!user) redirect("/auth/login");

  return (
    <>
      <Header />
      <main className="px-3 lg:px-14">{children}</main>
    </>
  );
};

export default DashboardLayout;
