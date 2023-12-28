"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Filter = ({
  placeholder,

  options,
  otherClasses,
  containerClasses,
}: {
  placeholder: string;

  options: any[];
  otherClasses?: string;
  containerClasses?: string;
}) => {
  return (
    <div className={`relative ${containerClasses}`}>
      <Select defaultValue={""}>
        <SelectTrigger className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}>
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options?.map((option, index) => {
              return (
                <SelectItem key={index} value={option.value}>
                  {option.name}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
