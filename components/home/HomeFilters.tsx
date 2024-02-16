"use client";

import { HomePageFilters } from "@/constants/filter";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const HomeFilters = () => {
  const [filters, setFilters] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (filters) {
      const timer = setTimeout(() => {
        if (filters) {
          router.push(`${pathname}?filters=${filters}`);
        } else {
          router.push(pathname);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [filters]);

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex ">
      {HomePageFilters?.map((filter) => (
        <Button
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            filters === filter.value
              ? "bg-primary-100 text-primary-500"
              : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 "
          }`}
          key={filter.value}
          onClick={() => {
            setFilters(filter.value);
          }}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
