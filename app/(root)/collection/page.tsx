import Filter from "@/components/shared/filter/Filter";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { QuestionFilters } from "@/constants/filter";
import { auth } from "@clerk/nextjs";
import { getSavedQuestions } from "@/lib/actions/user.action";
import QuestionCard from "@/components/card/QuestionCard";
import NoResult from "@/components/shared/NoResult";

const Collection = async () => {
  const { userId } = auth();

  if (!userId) return null;

  const result = await getSavedQuestions({ clerkId: userId });

  return (
    <>
      <h1 className="h1-bold text-dark200_light800">All Questions</h1>

      <div className="mt-11 flex justify-between max-sm:flex-col sm:items-center">
        <LocalSearchbar route="/" iconPosition="left" imgSrc="/assets/icons/search.svg" placeholder="Search for Question..." otherClasses="flex-1 " />
        <Filter otherClasses="min-h-[56px] sm:min-w-[170px]" containerClasses="flex md:hidden" placeholder="Select a Filter..." options={QuestionFilters} />
      </div>

      <div className="mt-10 flex flex-col gap-10">
        {result?.savedQuestions?.length === 0 ? (
          <NoResult
            title="There's no question to show"
            description=" Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get
        involved! 💡"
            link="/ask-question"
            linkText="Ask a Question"
          />
        ) : (
          result?.savedQuestions?.map((question: any) => (
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
    </>
  );
};

export default Collection;
