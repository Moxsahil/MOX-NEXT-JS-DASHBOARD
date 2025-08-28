import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex bg-dark-primary">
      {/* LEFT SIDEBAR */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-dark-secondary/95 backdrop-blur-xl border-r border-dark-border-primary shadow-2xl">
        <div className="p-4 border-b border-dark-border-primary/50">
          <Link
            href="/"
            className="flex items-center justify-center lg:justify-start gap-3 group transition-all duration-300"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg blur-sm opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-brand-primary to-brand-secondary p-2 rounded-lg shadow-glow">
                <Image src="/mylogo.png" alt="logo" width={24} height={24} className="relative z-10" />
              </div>
            </div>
            <div className="hidden lg:block">
              <span className="font-bold text-xl bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                MOX
              </span>
              <p className="text-xs text-dark-text-secondary font-medium tracking-wider">SCHOOL DASHBOARD</p>
            </div>
          </Link>
        </div>
        <div className="h-[calc(100vh-80px)] overflow-y-auto">
          <Menu />
        </div>
      </div>
      
      {/* RIGHT MAIN CONTENT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] flex flex-col min-h-screen">
        <div className="bg-dark-secondary/80 backdrop-blur-xl border-b border-dark-border-primary/50">
          <Navbar />
        </div>
        <div className="flex-1 overflow-y-auto bg-dark-primary">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
