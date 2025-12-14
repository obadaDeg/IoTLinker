"use client";

import Link from "next/link";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Gauge, LayoutDashboard, Zap, Users, HelpCircle } from "lucide-react";

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();

  const navItems = [
    { label: "My Channels", href: "/channels", icon: LayoutDashboard },
    { label: "Automation", href: "/dashboard/automation", icon: Zap },
    { label: "Community", href: "/community", icon: Users },
    { label: "Support", href: "/support", icon: HelpCircle },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-200">
                    <Gauge className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 tracking-tight">
                  IoTLinker
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      group inline-flex items-center px-4 pt-1 border-b-2 text-sm font-medium transition-all duration-200 ease-in-out h-full
                      ${isActive 
                        ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/30" 
                        : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 mr-2 ${isActive ? "text-indigo-500 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                 <div className="text-right hidden md:block">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-none">
                        {user.fullName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {user.primaryEmailAddress?.emailAddress}
                    </p>
                 </div>
                <UserButton afterSignOutUrl="/" appearance={{
                    elements: {
                        avatarBox: "w-9 h-9 border-2 border-indigo-100 dark:border-indigo-800"
                    }
                }}/>
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-medium shadow-md shadow-indigo-500/20 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}