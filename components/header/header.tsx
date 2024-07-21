import { UserButton } from "@/components/auth/user-button";
import { HeaderLogo } from "@/components/header/header-logo";
import { Navigation } from "@/components/header/navigation";
import { WelcomeMsg } from "@/components/header/welcome-msg";

export const Header = () => {
  return (
    <header className="bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 lg:ps-14 pb-36">
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-14">
          <div className="flex items-center lg:gap-x-6">
            <HeaderLogo />
            <Navigation />
          </div>
          <UserButton />
        </div>
        <WelcomeMsg />
      </div>
    </header>
  );
};
