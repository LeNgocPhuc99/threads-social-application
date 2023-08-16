"use client";

// nextjs import
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// constance import
import { sidebarLinks } from "@/constants";

const BottomBar = () => {
  const pathName = usePathname();

  return (
    <section className="bottom-bar">
      <div className="bottom-bar-container">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathName.includes(link.route) && link.route.length > 1) || // other page
            pathName === link.route; // home page
          // console.log
          return (
            <Link
              key={link.label}
              href={link.route}
              className={`bottom-bar-link ${isActive && "bg-primary-500"}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-subtle-medium text-light-1 max-sm:hidden">
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default BottomBar;
