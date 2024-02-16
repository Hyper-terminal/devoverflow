"use client";

import { deleteAnswer, deleteQuestion } from "@/lib/actions/user.action";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface EditDeleteActionProps {
  type: "Question" | "Answer";
  itemId: string | number;
}

const EditDeleteAction = ({ itemId, type }: EditDeleteActionProps) => {
  const router = useRouter();

  async function handleEdit() {
    if (type === "Answer") {
      // edit answer
      router.push(`/answer/edit/${itemId}`);
    } else {
      // edit question
      router.push(`/question/edit/${itemId}`);
    }
  }

  async function handleDelete() {
    if (type === "Answer") {
      // delete answer
      await deleteAnswer({ answerId: itemId.toString(), path: "" });
    } else {
      // delete question
      await deleteQuestion({ questionId: itemId.toString(), path: "" });
    }
  }

  return (
    <div className="flex gap-2 items-center">
      <Image className="cursor-pointer" src="/assets/icons/edit.svg" alt="edit icon" width={16} height={16} onClick={handleEdit} />
      <Image className="cursor-pointer" src="/assets/icons/trash.svg" alt="delete icon" width={16} height={16} onClick={handleDelete} />
    </div>
  );
};

export default EditDeleteAction;
