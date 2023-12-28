"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";

import React from "react";

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
  return (
    <div className={`background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4 ${otherClasses}`}>
      {iconPosition === "left" && <Image src={imgSrc ?? "/assets/icons/search.svg"} alt="search" width={24} height={24} className="cursor-pointer" />}{" "}
      <Input
        type="text"
        placeholder={placeholder ?? "Search"}
        onChange={onChange}
        className={cn(
          `paragraph-regular no-focus placeholder background-light800_darkgradient focus-visible:ring-0 focus-visible:outline-none border-none shadow-none outline-none ring-0`,
        )}
      />
      {iconPosition === "right" && <Image src={imgSrc ?? "/assets/icons/search.svg"} alt="search" width={24} height={24} className="cursor-pointer" />}{" "}
    </div>
  );
};

export default LocalSearchbar;
