import QuestionCard from "@/components/card/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { IQuestion } from "@/database/question.model";
import { getQuestionByTagId } from "@/lib/actions/tag.action";
import { URLProps } from "@/types";

const Page = async ({ params, searchParams }: URLProps) => {
  const result = await getQuestionByTagId({
    tagId: params?.id,
    page: 1,
    searchQuery: searchParams?.q,
  });

  return (
    <>
      <h1 className="h1-bold text-dark200_light800">{result.tagTitle}</h1>

      <div className="mt-11 w-full">
        <LocalSearchbar route="/" iconPosition="left" imgSrc="/assets/icons/search.svg" placeholder="Search for tag Question..." otherClasses="flex-1 " />
      </div>

      <div className="mt-10 flex flex-col gap-10">
        {result?.questions?.length === 0 ? (
          <NoResult
            title="There's no question to show"
            description=" Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get
      involved! 💡"
            link="/ask-question"
            linkText="Ask a Question"
          />
        ) : (
          result?.questions?.map((question: IQuestion) => (
            <QuestionCard
              author={question?.author}
              answers={question?.answers?.length}
              createdAt={question?.createdAt}
              tags={question?.tags}
              upvotes={question?.upvotes?.length}
              views={question?.views}
              question={question?.title}
              key={question?._id}
              avatarSrc="/assets/icons/account.svg"
              _id={question?._id}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Page;
