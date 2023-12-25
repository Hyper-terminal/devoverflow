"use client";

import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constants";
import { SignedOut} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LeftSidebar = () => {
  const pathname = usePathname();
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex flex-col justify-between  border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px] ">
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((sidebarLink) => {
          const isActive =
            (pathname.includes(sidebarLink.route) &&
              sidebarLink.route.length > 1) ||
            pathname === sidebarLink.route;

          return (
            <Link
              key={sidebarLink.route}
              href={sidebarLink.route}
              className={`${
                isActive
                  ? "primary-gradient rounded-lg text-light-900"
                  : "text-dark300_light900 "
              } flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              <Image
                className={`${isActive ? "" : "invert-colors"}`}
                src={sidebarLink.imgURL}
                alt={sidebarLink.label}
                width={20}
                height={20}
              />
              <p
                className={`${
                  isActive ? "base-bold" : "base-medium"
                } hidden max-lg:hidden lg:block`}
              >
                {sidebarLink.label}
              </p>
            </Link>
          );
        })}
      </div>
      <SignedOut>
        <div className="flex flex-col gap-5 mt-3">
          <Link href="/sign-in">
            <Button className="small-medium btn-secondary flex min-h-[41px] w-full items-center rounded-lg px-4 py-3">
              <Image
                src="/assets/icons/account.svg"
                alt="Sign In"
                width={16}
                height={16}
                className="invert-colors lg:hidden"
              />
              <span className="primary-text-gradient max-lg:hidden">
                Log In
              </span>
            </Button>
          </Link>

          <Link href="/sign-up">
            <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <Image
                src="/assets/icons/sign-up.svg"
                alt="Sign In"
                width={16}
                height={16}
                className="invert-colors lg:hidden"
              />
              <span className="max-lg:hidden"> Sign Up </span>
            </Button>
          </Link>
        </div>
      </SignedOut>
    </section>
  );
};

export default LeftSidebar;
