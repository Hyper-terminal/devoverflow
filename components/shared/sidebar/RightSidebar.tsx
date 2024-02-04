import { getHotQuestions } from "@/lib/actions/question.action";
import { getHotTags } from "@/lib/actions/tag.action";
import Image from "next/image";
import React from "react";

const RightSidebar = async () => {
  const hotQuestions = await getHotQuestions();
  const popularTags = await getHotTags();

  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex w-[350px] flex-col gap-8 border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden ">
      <h2 className="h3-bold text-dark200_light900">Top Questions</h2>
      <div className="mt-6 flex flex-col gap-7">
        {hotQuestions?.map((question) => (
          <div className="flex gap-2 justify-between ">
            <h4 className="text-dark200_light900">{question.title}</h4>
            <Image src="/assets/icons/chevron-right.svg" alt="right arrow" height={16} width={16} />
          </div>
        ))}
      </div>

      <h2 className="h2-bold text-dark200_light800">Popular Tags</h2>
      <div className="mt-6 flex flex-col gap-7 text-dark100_light900">
        {popularTags?.map((tag) => (
          <div className="flex justify-between">
            <h4>{tag?.name}</h4>
            <h4>{tag?.questions}</h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RightSidebar;
