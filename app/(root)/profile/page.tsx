import QuestionCard from "@/components/card/QuestionCard";
import Metric from "@/components/shared/Metric";
import StatsCard from "@/components/shared/StatsCard";
import { getAllAnswersByUser, getAllQuestionByUser, getUserInfoById } from "@/lib/actions/user.action";
import { SignedIn, auth } from "@clerk/nextjs";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IAnswer } from "@/database/answer.model";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = async () => {
  const { userId } = auth();

  const result = await getUserInfoById({
    userId: userId!,
  });

  if (!result) {
    return <div className="text-dark200_light800 my-20 text-center">User not found</div>;
  }

  const answers = await getAllAnswersByUser({ userId: userId! });
  const questions = await getAllQuestionByUser({ userId: userId! });

  const joinedAtDate = new Date(result?.joinedAt);
  const joinedAtFormatted = joinedAtDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <section>
      <SignedIn>
        <Link className="float-right" href={`/profile/edit`}>
          <Button className="bg-gray-100">Edit Profile</Button>
        </Link>
      </SignedIn>
      <div className="flex items-center gap-4">
        <Image src={result.picture} alt="avatar" className="rounded-full object-contain p-1" width={100} height={100} />
        <div>
          <h1 className="h1-bold text-dark200_light800">{result.name}</h1>
          <p className="text-dark200_light800 text-sm">@{result.username}</p>

          <div className="flex flex-wrap  items-center gap-8">
            <Metric
              textStyles="text-blue-500 dark:text-blue-400 font-semibold cursor-pointer"
              href={`mailto:${result?.email}`}
              title=""
              value={String(result?.email)}
              alt="link"
              icon="/assets/icons/link.svg"
            />
            {result?.location ? <Metric title="" value={String(result?.location)} alt="location" icon="/assets/icons/location.svg" /> : ""}
            <Metric titlePosition="left" title="Joined" value={String(joinedAtFormatted)} alt="calendar" icon="/assets/icons/calendar.svg" />
          </div>
          <p className="text-dark300_light700 my-4 text-sm">{result?.bio}</p>
        </div>
      </div>

      <div className="mt-11">
        <h4 className="text-dark200_light900 text-xl font-semibold capitalize">Stats</h4>
        <div className="flex flex-wrap items-center gap-8 mt-8">
          <StatsCard
            contentArray={[
              { title: "Questions", value: result?.totalUserQuestions },
              { title: "Answers", value: result?.totalUserAnswers },
            ]}
          />
        </div>
      </div>

      <div className="mt-11">
        <h4 className="text-dark200_light900 text-xl font-semibold capitalize">Top Posts</h4>

        <Tabs defaultValue="questions" className="">
          <TabsList className="background-light800_dark400 ">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="answers">Answers</TabsTrigger>
          </TabsList>
          <TabsContent value="questions">
            {questions?.map((question: any) => (
              <QuestionCard
                key={question?._id}
                _id={question?._id}
                createdAt={question?.createdAt}
                avatarSrc={result?.picture}
                question={question?.title}
                tags={question?.tags}
                upvotes={question?.upvotes.length}
                answers={question?.answers.length}
                views={question?.views}
                author={result}
              />
            ))}
          </TabsContent>
          <TabsContent value="answers">
            {answers?.map((answer: IAnswer) => (
              <QuestionCard
                key={answer?._id}
                _id={answer?._id}
                createdAt={answer?.createdOn}
                avatarSrc={result?.picture}
                question={answer?.content}
                tags={[]}
                upvotes={0}
                answers={0}
                views={0}
                author={result}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Page;
