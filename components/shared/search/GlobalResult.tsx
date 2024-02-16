import { globalSearch } from "@/lib/actions/general.action";
import { useSearchParams } from "next/navigation"
import { useEffect } from "react";

export default function GlobalResult() {
    const searchParams = useSearchParams();

    useEffect(() => {
        async function fetchData() {
            const res = await globalSearch({ query: searchParams.get("globalQuery"), type: 'type' });
        }

        fetchData();
    }, [searchParams]);
    return <div className="background-light800_darkgradient text-dark200_light800 absolute flex flex-col min-h-[150px] grow w-full mt-1 items-center gap-1 rounded-xl px-4 ">
        <h3>Filters</h3>
        <h3>Top Matches</h3>
    </div>
}