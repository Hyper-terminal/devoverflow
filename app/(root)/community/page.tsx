import UserCard from "@/components/card/UserCard";
import Filter from "@/components/shared/filter/Filter";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { UserFilters } from "@/constants/filter";
import { getAllUsers } from "@/lib/actions/user.action";
import Link from "next/link";

const Community = async ({ searchParams }: any) => {
  const users = await getAllUsers({
    searchQuery: searchParams.q as string,
  });

  return (
    <>
      <h1 className="h1-bold text-dark200_light800">All Users</h1>

      <div className="mt-11 flex justify-between max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/community"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for Users..."
          otherClasses="flex-1 "
        />
        <Filter otherClasses="min-h-[56px] sm:min-w-[170px]" placeholder="Select a Filter..." options={UserFilters} />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {!!users && users?.length > 0 ? (
          users?.map((item) => {
            return <UserCard key={item?._id} user={item} />;
          })
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p>No users yet</p>
            <Link href="/sign-up" className="mt-2 font-bold text-accent-blue">
              Join to be the first
            </Link>
          </div>
        )}
      </section>
    </>
  );
};

export default Community;
