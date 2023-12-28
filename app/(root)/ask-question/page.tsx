import Question from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

const AskQuestion = async () => {
  // const { userId } = auth();
  const userId = "clerk123";

  // find user first
  const mongoDbUser = await getUserById({ userId });

  if (!mongoDbUser) {
    redirect("/sign-in");
  }

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
        <Question mongoDBUserID={JSON.stringify(mongoDbUser?._id || "")} />
      </div>
    </div>
  );
};

export default AskQuestion;
