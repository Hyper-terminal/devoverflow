"use client";

import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const GlobalSearch = ({ placeholder }: { placeholder?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("globalQuery");
  const pathname = usePathname();
  const [search, setSearch] = useState(query || "");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        // keep all queries other than q and globalQuery
        const newQuery = new URLSearchParams(searchParams.toString());
        newQuery.append("globalQuery", search);
        newQuery.delete("q");

        router.push(`${pathname}?${newQuery.toString()}`);
      } else {
        const newQuery = new URLSearchParams(searchParams.toString());
        newQuery.delete("globalQuery");
        newQuery.delete("q");
        router.push(pathname);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search, router]);

  return (
    <>
      <Popover>
        <div className="relative w-full max-w-[600px] max-lg:hidden">
          <div className="background-light800_darkgradient text-dark200_light800 relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4 ">
            <Image src="/assets/icons/search.svg" alt="search" width={24} height={24} className="cursor-pointer" />
            <PopoverTrigger>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder={placeholder ?? "Search globally"}
                className={cn(
                  `paragraph-regular no-focus placeholder background-light800_darkgradient focus-visible:ring-0 focus-visible:outline-none border-none shadow-none outline-none ring-0 `
                )}
              />
            </PopoverTrigger>
          </div>
          <PopoverContent className="text-dark200_light800 min-w-full  background-light800_darkgradient text-sm">
            Place content for the popover here.jhfgjdfhgjdfhgjhdfghdfkgjhdfkghk
          </PopoverContent>
        </div>
      </Popover>
    </>
  );
};

export default GlobalSearch;
