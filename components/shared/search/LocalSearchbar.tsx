"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import React, { useEffect, useState } from "react";

interface CustomInputProps {
  iconPosition?: "left" | "right";
  imgSrc?: string;
  route?: string;
  placeholder?: string;
  otherClasses?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search";
  name?: string;
  id?: string;
  autoComplete?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  inputMode?: "text" | "none";
}

const LocalSearchbar = ({ iconPosition, imgSrc, route, placeholder, otherClasses, onChange }: CustomInputProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [search, setSearch] = useState(query || "");

  useEffect(() => {
    if (route) {
      const timer = setTimeout(() => {
        if (search) {
          router.push(`${route}?q=${search}`);
        } else {
          router.push(route);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [search, route, router]);

  return (
    <div className={`background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4 ${otherClasses}`}>
      {iconPosition === "left" && <Image src={imgSrc ?? "/assets/icons/search.svg"} alt="search" width={24} height={24} className="cursor-pointer" />}{" "}
      <Input
        type="text"
        placeholder={placeholder ?? "Search"}
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        className={cn(
          `paragraph-regular no-focus placeholder background-light800_darkgradient focus-visible:ring-0 focus-visible:outline-none border-none shadow-none outline-none ring-0`
        )}
      />
      {iconPosition === "right" && (
        <Image src={imgSrc ?? "/assets/icons/search.svg"} alt="search" width={24} height={24} className="cursor-pointer" />
      )}{" "}
    </div>
  );
};

export default LocalSearchbar;
