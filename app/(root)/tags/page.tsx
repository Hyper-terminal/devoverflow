import TagCard from "@/components/card/TagCard";
import NoResult from "@/components/shared/NoResult";
import Filter from "@/components/shared/filter/Filter";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { UserFilters } from "@/constants/filter";
import { getAllTags } from "@/lib/actions/tag.action";

const Tags = async () => {
  const tags = await getAllTags({});
  return (
    <>
      <h1 className="h1-bold text-dark200_light800">All Users</h1>

      <div className="mt-11 flex justify-between max-sm:flex-col sm:items-center">
        <LocalSearchbar route="/community" iconPosition="left" imgSrc="/assets/icons/search.svg" placeholder="Search for Users..." otherClasses="flex-1 " />
        <Filter otherClasses="min-h-[56px] sm:min-w-[170px]" placeholder="Select a Filter..." options={UserFilters} />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {!!tags && tags?.length > 0 ? (
          tags?.map((tag) => {
            return <TagCard key={tag?._id} tag={tag} />;
          })
        ) : (
          <NoResult link="/ask-question" linkText="Ask a question" description="It looks like there are no tags." title="No tags found" />
        )}
      </section>
    </>
  );
};

export default Tags;
