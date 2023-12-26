"use client";

import HomeFilters from "@/components/home/HomeFilters";
import QuestionCard from "@/components/home/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import Filter from "@/components/shared/filter/Filter";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filter";
import Link from "next/link";

const questions = [
  {
    _id: 1,
    question: "What is the capital of France?",
    answer: "Paris",
    tags: [{ _id: 1, name: "Geography", color: "#FF0000" }],
    author: "John Doe",
    upvotes: 10,
    views: 100,
    answers: 2,
    createdAt: "2023-01-01",
  },
  {
    _id: 2,
    question: "What is the capital of France?",
    answer: "Paris",
    tags: [{ _id: 1, name: "Geography", color: "#FF0000" }],
    author: "John Doe",
    upvotes: 10,
    views: 100,
    answers: 2,
    createdAt: "2023-01-01",
  },
];

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark200_light800">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient text-dark200_light800 min-h-[46px] px-4 py-3 !text-light-900">Ask a Question</Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between max-sm:flex-col sm:items-center">
        <LocalSearchbar route="/" iconPosition="left" imgSrc="/assets/icons/search.svg" placeholder="Search for Question..." otherClasses="flex-1 " />
        <Filter
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="flex md:hidden"
          placeholder="Select a Filter..."
          options={HomePageFilters}
          onChange={() => {}}
          value=""
        />
      </div>
      <HomeFilters />

      <div className="mt-10 flex flex-col gap-10">
        {questions?.length === 0 ? (
          <NoResult
            title="There's no question to show"
            description=" Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get
        involved! 💡"
            link="/ask-question"
            linkText="Ask a Question"
          />
        ) : (
          questions.map((question) => (
            <QuestionCard
              author={question?.author}
              answers={question?.answers}
              createdAt={question?.createdAt}
              tags={question?.tags}
              upvotes={question?.upvotes}
              views={question?.views}
              question={question?.question}
              key={question?._id}
              avatarSrc="/assets/icons/account.svg"
              _id={question?._id}
            />
          ))
        )}
      </div>
    </>
  );
}
