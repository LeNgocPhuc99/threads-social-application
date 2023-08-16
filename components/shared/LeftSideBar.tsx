"use client";

// nextjs import
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

// clerk import
import { SignedIn, SignOutButton } from "@clerk/nextjs";

// const import
import { sidebarLinks } from "@/constants";

const LeftSideBar = () => {
  const router = useRouter();
  const pathName = usePathname();

  return (
    <section className="custom-scrollbar left-side-bar">
      <div className="flex flex-1 flex-col w-full gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathName.includes(link.route) && link.route.length > 1) || // other page
            pathName === link.route; // home page
          // console.log
          return (
            <Link
              key={link.label}
              href={link.route}
              className={`left-sidebar-link ${isActive && "bg-primary-500"}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>
      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push("/sign-in")}>
            <div className="flex cursor-pointer gap-4 p-4">
              <Image
                src="assets/logout.svg"
                alt="logout"
                width={24}
                height={24}
              />
              <p className="text-light-2 max-lg:hidden">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
};

export default LeftSideBar;
