import Image from "next/image";

interface IStatsCard {
  icon?: string;
  alt?: string;
  contentArray: { title: string; value: string | number }[];
}

const StatsCard = ({ icon, alt, contentArray }: IStatsCard) => {
  return (
    <div className="background-light850_dark100 flex px-8 items-center gap-2 rounded-md border py-6 text-sm shadow-md dark:border-none dark:shadow-none ">
      {icon ? <Image src="/assets/images/placeholder.png" alt={alt!} width={70} height={70} className="rounded-t-md" /> : ""}

      <div className="flex items-center gap-4">
        {contentArray.map((content) => (
          <div key={content.title} className="flex flex-col items-center justify-center gap-1">
            <p className="text-dark300_light700">{content.title}</p>
            <p className="text-dark200_light800 text-xs">{content.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCard;
