import { globalSearch } from "@/lib/actions/general.action";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import RenderTag from "../RenderTag";
import { GlobalSearchFilters } from "@/constants/filter";

export default function GlobalResult() {
  const [results, setResults] = useState([]);
  const [type, setType] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    async function fetchData() {
      const res = await globalSearch({
        query: searchParams.get("globalQuery"),
        type: type,
      });
      setResults(res);
    }
    fetchData();
  }, [searchParams, type]);

  return (
    <div className="background-light800_darkgradient text-dark200_light800 absolute mt-1 flex min-h-[150px] w-full grow flex-col items-center gap-1 rounded-xl px-4 ">
      <div className="flex gap-5 my-6 flex-wrap items-center">
        <h3>Filters</h3>

        {GlobalSearchFilters?.map((item) => (
          <div key={item.name} onClickCapture={() => setType(item?.value)}>
            <RenderTag
              className="background-light800_dark300"
              _id={item?.value}
              name={item?.name}
            />
          </div>
        ))}
      </div>
      <h3>Top Matches</h3>
      {results?.map((item: any, index) => (
        <div key={item?._id || index + 1}>
          {item?.name || item?.title || item?.question}
        </div>
      ))}
    </div>
  );
}
