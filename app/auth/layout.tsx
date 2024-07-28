import { redirect } from "next/navigation";

import { currentUser } from "@/lib/auth/helper";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();

  if (user) redirect("/");

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-b from-blue-700 to-blue-500">
      {children}
    </div>
  );
};

export default AuthLayout;
