import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const EditQuestionPage = async ({ params }: ParamsProps) => {
  const { userId } = auth();

  const mongoUser = await getUserById({ userId });
  const result = await getQuestionById({ questionId: params.id });

  if (!mongoUser) {
    redirect("/sign-in");
  }

  return (
    <>
      <h1 className="h1-bold mb-5 text-dark100_light900">Edit Question</h1>
      <Question mongoDBUserID={mongoUser._id} type="edit" questionDetails={JSON.stringify(result)} />;
    </>
  );
};

export default EditQuestionPage;
