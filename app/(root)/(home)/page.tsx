import QuestionCard from "@/components/card/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import NoResult from "@/components/shared/NoResult";
import Filter from "@/components/shared/filter/Filter";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { HomePageFilters } from "@/constants/filter";
import { getQuestions } from "@/lib/actions/question.action";

import Link from "next/link";

export default async function Home({ searchParams }: any) {
  const { questions, isNext } = await getQuestions({
    searchQuery: searchParams.q as string,
    filter: searchParams.filters,
    page: searchParams.page ? Number(searchParams.page) : 1,
  });

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
          questions?.map((question: any) => (
            <QuestionCard
              author={question?.author}
              answers={question?.answers?.length}
              createdAt={question?.createdAt}
              tags={question?.tags}
              upvotes={question?.upvotes}
              views={question?.views}
              question={question?.title}
              key={question?._id}
              avatarSrc="/assets/icons/account.svg"
              _id={question?._id}
            />
          ))
        )}
      </div>

      <Pagination className="my-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={searchParams.page ? Number(searchParams.page) === 1 : true}
              className=" background-light800_dark300 text-dark500_light700"
              href={`?q=${searchParams.q || ""}&filters=${searchParams.filters || ""}&page=${searchParams.page ? Number(searchParams.page) - 1 : 1}`}
            />
          </PaginationItem>
          <PaginationItem>
            <p className="primary-gradient rounded-md text-sm my-0 text-dark200_light800 flex justify-center items-center px-4 py-3 !text-light-900">
              {searchParams.page}
            </p>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              disabled={!isNext}
              className=" background-light800_dark300 text-dark500_light700"
              href={`?q=${searchParams.q || ""}&filters=${searchParams.filters || ""}&page=${searchParams.page ? Number(searchParams.page) + 1 : 1}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
