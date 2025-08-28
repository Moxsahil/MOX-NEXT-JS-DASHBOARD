"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const role = user?.publicMetadata.role;

    if (role) {
      router.push(`/${role}`);
    }
  }, [user, router]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-tertiary">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent-purple/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMC41IiBmaWxsPSIjNjM2NmYxIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4K')] opacity-30"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <SignIn.Root>
          <div className="w-full max-w-md animate-fade-in">
            {/* Logo and Header Section */}
            <div className="text-center mb-8 animate-slide-down">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-brand-primary to-brand-secondary shadow-glow mb-6 animate-bounce-gentle">
                <Image 
                  src="/mylogo.png" 
                  alt="MOX Logo" 
                  width={40} 
                  height={40} 
                  className="drop-shadow-lg"
                />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                Welcome to <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">MOX</span>
              </h1>
              <p className="text-gray-300 text-lg font-medium">
                School Management Dashboard
              </p>
            </div>

            <SignIn.Step
              name="start"
              className="bg-dark-secondary/80 backdrop-blur-xl border border-dark-border-primary rounded-3xl p-8 shadow-2xl animate-slide-up"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-dark-text-primary mb-2">Sign In</h2>
                <p className="text-dark-text-secondary">Access your dashboard</p>
              </div>

              <Clerk.GlobalError className="mb-4 p-3 bg-status-error-bg/20 border border-status-error-border rounded-xl text-sm text-status-error-text animate-shake" />

              <div className="space-y-6">
                <Clerk.Field name="identifier" className="group">
                  <Clerk.Label className="block text-sm font-semibold text-white mb-2 transition-all duration-200 group-focus-within:text-brand-primary">
                    Username or Email
                  </Clerk.Label>
                  <div className="relative">
                    <Clerk.Input
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-white/10 border-2 border-gray-300/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:bg-white/20 transition-all duration-200 hover:bg-white/15 hover:border-gray-300/50"
                      placeholder="Enter your username or email"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="w-5 h-5 text-gray-400 group-focus-within:text-brand-primary transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <Clerk.FieldError className="mt-1 text-sm text-status-error-text animate-fade-in" />
                </Clerk.Field>

                <Clerk.Field name="password" className="group">
                  <Clerk.Label className="block text-sm font-semibold text-white mb-2 transition-all duration-200 group-focus-within:text-brand-primary">
                    Password
                  </Clerk.Label>
                  <div className="relative">
                    <Clerk.Input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full px-4 py-3 bg-white/10 border-2 border-gray-300/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:bg-white/20 transition-all duration-200 hover:bg-white/15 hover:border-gray-300/50 pr-12"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-brand-primary transition-colors duration-200"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.636 6.636m3.242 3.242L12 12m0 0l2.121 2.121M12 12l-2.121-2.121M12 12l3.243 3.243M12 12l-3.243-3.243" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <Clerk.FieldError className="mt-1 text-sm text-status-error-text animate-fade-in" />
                </Clerk.Field>

                <SignIn.Action
                  submit
                  onClick={() => setIsLoading(true)}
                  className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-semibold py-3 px-6 rounded-xl shadow-glow hover:shadow-glow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </SignIn.Action>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-dark-border-secondary">
                <p className="text-center text-sm text-dark-text-tertiary">
                  Need help? Contact your system administrator
                </p>
              </div>
            </SignIn.Step>
          </div>
        </SignIn.Root>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 right-10 w-4 h-4 bg-brand-primary/30 rounded-full animate-ping"></div>
      <div className="absolute bottom-20 left-20 w-2 h-2 bg-brand-secondary/40 rounded-full animate-ping delay-1000"></div>
      <div className="absolute top-1/3 left-10 w-3 h-3 bg-accent-purple/20 rounded-full animate-ping delay-2000"></div>
    </div>
  );
};

export default LoginPage;
