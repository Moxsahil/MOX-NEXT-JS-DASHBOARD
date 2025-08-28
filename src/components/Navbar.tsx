import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import SearchBox from "./SearchBox";

const Navbar = async () => {
  const user = await currentUser();
  return (
    <div className="flex items-center justify-between p-6">
      {/* SEARCH BAR */}
      <SearchBox />

      {/* ICONS AND USER */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative group">
          <div className="bg-dark-tertiary/80 backdrop-blur-xl rounded-xl w-12 h-12 flex items-center justify-center cursor-pointer border border-dark-border-secondary shadow-xl hover:shadow-glow transition-all duration-300 group-hover:scale-105 hover:bg-dark-elevated">
            <svg
              className="w-5 h-5 text-dark-text-secondary group-hover:text-dark-text-primary transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-5 -5v-6a6 6 0 1 0 -12 0v6l-5 5h5m6 0v1a3 3 0 0 1 -6 0v-1"
              />
            </svg>
            <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-gradient-to-r from-status-error-primary to-accent-red text-white rounded-full text-xs font-bold shadow-lg border-2 border-dark-primary">
              3
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-sm font-semibold text-dark-text-primary leading-tight">
            {user?.fullName}
          </span>
          <span className="text-xs text-dark-text-secondary font-medium capitalize tracking-wider">
            {user?.publicMetadata?.role as string}
          </span>
        </div>

        {/* User Button with modern styling */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full blur-md opacity-30"></div>
          <div className="relative bg-dark-tertiary/90 backdrop-blur-xl  rounded-full shadow-xl hover:shadow-glow transition-all duration-300">
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "w-9 h-9 rounded-full ring-2 ring-dark-border-secondary",
                  userButtonPopoverCard:
                    "bg-dark-secondary/95 backdrop-blur-xl shadow-2xl border border-dark-border-primary",
                  userButtonPopoverActionButton:
                    "hover:bg-dark-elevated text-dark-text-primary",
                  userButtonPopoverActionButtonText: "text-dark-text-primary",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
