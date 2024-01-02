import Link from "next/link";

interface Props {
  tag: {
    _id: string;
    name: string;
    questions: string[];
  };
}

const TagCard = ({ tag }: Props) => {
  return (
    <Link href={`/tags/${tag._id}`} className="w-full rounded-2xl shadow-md dark:shadow-none max-xs:min-w-full xs:w-[260px]">
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">{tag.name}</h3>
          <p>
            <span className="primary-text-gradient mr-2.5 font-bold">{tag?.questions?.length}+</span> Questions
          </p>
        </div>
      </article>
    </Link>
  );
};

export default TagCard;
