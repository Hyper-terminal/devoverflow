"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleFilterChange = (value: string) => {
        console.log(value);
        console.log(searchParams.get("filters"));

        // if value is empty or same as previous one, remove the filter query
        if (!value || searchParams.get("filters") === value) {
            return router.push(pathname);
        } else {
            // if value is not empty, add the filter query
            router.push(`${pathname}?filters=${value}`);
        }
    };

    return (
        <div className={`relative mx-5 ${containerClasses}`}>
            <Select onValueChange={handleFilterChange} defaultValue={""}>
                <SelectTrigger className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}>
                    <div className="line-clamp-1 flex-1 text-left">
                        <SelectValue placeholder={placeholder} />
                    </div>
                </SelectTrigger>
                <SelectContent className="background-light800_dark300 text-dark500_light700">
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