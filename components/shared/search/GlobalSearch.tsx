import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const GlobalSearch = ({ placeholder }: { placeholder?: string }) => {
  return (
    <div className="relative w-full max-w-[600px] max-lg:hidden">
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image src="/assets/icons/search.svg" alt="search" width={24} height={24} className="cursor-pointer" />
        <Input
          type="text"
          placeholder={placeholder ?? "Search globally"}
          className={cn(
            `paragraph-regular no-focus placeholder background-light800_darkgradient focus-visible:ring-0 focus-visible:outline-none border-none shadow-none outline-none ring-0 `,
          )}
        />
      </div>
    </div>
  );
};

export default GlobalSearch;
