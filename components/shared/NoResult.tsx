import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

interface NoResultProps {
  title?: string;
  description?: string;
  link: string;
  linkText: string;
}

const NoResult = ({ title, description, link, linkText }: NoResultProps) => {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center gap-5">
      <Image src="/assets/images/light-illustration.png" alt="no result illustrations" width={270} height={200} className="block object-contain dark:hidden" />
      <Image src="/assets/images/dark-illustration.png" alt="no result illustrations" width={270} height={200} className=" hidden  object-contain dark:flex" />

      <h2 className="h2-bold text-dark200_light800">{title}</h2>
      <h3 className="body-regular text-dark500_light700 w-7/12 text-center">{description}</h3>
      <Link href={link} className="flex justify-end max-sm:w-full">
        <Button className="primary-gradient text-dark200_light800 min-h-[46px] px-4 py-3 !text-light-900">{linkText}</Button>
      </Link>
    </div>
  );
};

export default NoResult;
