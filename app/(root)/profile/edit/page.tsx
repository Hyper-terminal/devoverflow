import Profile from "@/components/forms/Profile";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const page = async () => {
  const { userId } = auth();

  const mongoUser = await getUserById({ userId });

  if (!mongoUser) {
    redirect("/sign-in");
  }

  return (
    <>
      <h1 className="h1-bold mb-5 text-dark100_light900">Edit Profile</h1>
      <Profile mongoUser={mongoUser} />
    </>
  );
};

export default page;
