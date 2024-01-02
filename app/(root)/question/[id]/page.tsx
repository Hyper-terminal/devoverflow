import Answer from "@/components/forms/Answer";
import Metric from "@/components/shared/Metric";
import ParseHtml from "@/components/shared/ParseHtml";
import RenderTag from "@/components/shared/RenderTag";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { formatAndDivideNumber, getTimeStamp } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Fragment } from "react";

export default async function Page({ params }: { params: any }) {
  const { userId } = auth();

  // find user first
  const mongoDbUser = await getUserById({ userId });

  if (!mongoDbUser) {
    redirect("/sign-in");
  }

  const questionDetails = await getQuestionById({ questionId: params.id });

  if (!questionDetails) {
    redirect("/404");
  }

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse items-center justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link className="flex w-full items-center justify-start gap-4" href={`/profile/${questionDetails?.author?._id}`}>
            <Image className="rounded-full" src={questionDetails?.author?.picture} alt="" width={16} height={16} />
            <p className="paragraph-semibold text-dark300_light700">{questionDetails?.author?.name}</p>
          </Link>

          <div className="flex justify-end">Voting</div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3 w-full text-left">{questionDetails.title}</h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          icon="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimeStamp(questionDetails?.createdAt)}`}
          title=" Asked"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          icon="/assets/icons/message.svg"
          alt="answers"
          value={formatAndDivideNumber(questionDetails.answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          icon="/assets/icons/eye.svg"
          alt="views"
          value={formatAndDivideNumber(questionDetails.views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      <ParseHtml data={questionDetails.content} />

      <div className="mt-8 flex flex-wrap gap-8">
        {questionDetails.tags.map((tag: any) => (
          <RenderTag _id={tag._id} key={tag._id} name={tag.name} />
        ))}
      </div>

      <Answer questionId={questionDetails._id} mongoDbUserId={JSON.stringify(mongoDbUser._id)} />

      {questionDetails?.answers?.map((answer: any) => (
        <Fragment key={answer._id}>
          <div className="flex w-full flex-col-reverse items-center justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
            <Link className="flex w-full items-center justify-start gap-4" href={`/profile/${answer?.author?._id}`}>
              <Image className="rounded-full" src={answer?.author?.picture} alt="" width={16} height={16} />
              <p className="paragraph-semibold text-dark300_light700">{answer?.author?.name}</p>
            </Link>

            <div className="flex justify-end">Voting</div>
          </div>

          <div className="mb-8 mt-5 flex flex-wrap gap-4">
            <Metric
              icon="/assets/icons/clock.svg"
              alt="clock icon"
              value={` asked ${getTimeStamp(answer?.createdAt)}`}
              title=" Asked"
              textStyles="small-medium text-dark400_light800"
            />
            <Metric
              icon="/assets/icons/eye.svg"
              alt="views"
              value={formatAndDivideNumber(answer.views)}
              title=" Views"
              textStyles="small-medium text-dark400_light800"
            />
          </div>

          <ParseHtml data={answer.content} />
        </Fragment>
      ))}
    </>
  );
}
