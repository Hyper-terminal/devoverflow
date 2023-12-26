import { formatAndDivideNumber, getTimeStamp } from "@/lib/utils";
import Link from "next/link";
import Metric from "../shared/Metric";
import RenderTag from "../shared/RenderTag";

interface QuestionCardProps {
  question: string;
  tags: any[];
  author: any;
  upvotes: string | number;
  views: string | number;
  answers: string | number;
  createdAt: Date;
  avatarSrc: string;
  _id: string | number;
}

const QuestionCard = ({ _id, question, tags, author, upvotes, views, answers, createdAt, avatarSrc }: QuestionCardProps) => {
  return (
    <>
      <div className="dark:dark-gradient flex w-full flex-col gap-4 rounded-xl border px-3 py-4 shadow-md dark:border-none">
        <div className="body-medium text-dark400_light700 block sm:hidden">{getTimeStamp(createdAt)}</div>
        <Link href={`/question/${_id}`}>
          <h1 className="h1-bold text-dark200_light800 line-clamp-1 cursor-pointer">{question}</h1>
        </Link>
        {tags?.map((tag) => <RenderTag key={tag._id} _id={tag._id} name={tag.name} />)}

        <div className="flex flex-wrap items-center justify-between">
          <Metric
            href={`/user/${author?._id}`}
            icon="/assets/icons/avatar.svg"
            alt="avatar"
            value={`Author - `}
            title={getTimeStamp(createdAt)}
            isAuthor={true}
            textStyles="body-medium text-dark400_light700"
          />

          <div className="flex gap-4">
            <Metric
              icon="/assets/icons/like.svg"
              alt="upvotes"
              value={formatAndDivideNumber(upvotes)}
              title=" Votes"
              textStyles="small-medium text-dark400_light800"
            />
            <Metric
              icon="/assets/icons/message.svg"
              alt="answers"
              value={formatAndDivideNumber(answers)}
              title=" Answers"
              textStyles="small-medium text-dark400_light800"
            />
            <Metric
              icon="/assets/icons/eye.svg"
              alt="views"
              value={formatAndDivideNumber(views)}
              title=" Views"
              textStyles="small-medium text-dark400_light800"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionCard;
