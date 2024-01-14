"use client";

/**
 * Renders the vote count and controls for a question or answer.
 *
 * @param type - The type of the item (question or answer).
 * @param itemId - The ID of the item.
 * @param userId - The ID of the user.
 * @param upvotes - The number of upvotes.
 * @param downvotes - The number of downvotes.
 * @param hasSaved - Indicates whether the item has been saved by the user.
 * @param hasupvoted - Indicates whether the user has upvoted the item.
 * @param hasdownvoted - Indicates whether the user has downvoted the item.
 * @returns The rendered Votes component.
 */

import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import { downvoteQuestion, upvoteQuestion } from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { formatAndDivideNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface VotesProps {
  type: "question" | "answer";
  itemId: string;
  userId: string;
  upvotes?: number;
  downvotes?: number;
  hasSaved?: boolean;
  hasupvoted?: boolean;
  hasdownvoted?: boolean;
}

const Votes = ({ type, itemId, userId, upvotes, downvotes, hasSaved, hasdownvoted, hasupvoted }: VotesProps) => {
  const pathname = usePathname();

  async function handleVote(params: string) {
    if (!userId) return console.log("not logged in");

    if (params === "upvote") {
      if (type === "question") {
        await upvoteQuestion({
          questionId: itemId,
          userId,
          hasdownVoted: hasdownvoted!,
          hasupVoted: hasupvoted!,
          path: pathname,
        });
      } else if (type === "answer") {
        await upvoteAnswer({
          answerId: itemId,
          userId,
          hasdownVoted: hasdownvoted!,
          hasupVoted: hasupvoted!,
          path: pathname,
        });
      }
    } else if (params === "downvote") {
      if (type === "question") {
        await downvoteQuestion({
          questionId: itemId,
          userId,
          hasdownVoted: hasdownvoted!,
          hasupVoted: hasupvoted!,
          path: pathname,
        });
      } else if (type === "answer") {
        await downvoteAnswer({
          answerId: itemId,
          userId,
          hasdownVoted: hasdownvoted!,
          hasupVoted: hasupvoted!,
          path: pathname,
        });
      }
    }
  }

  async function handleSave() {
    try {
      if (!userId) return console.log("not logged in");

      if (type === "question") {
        await toggleSaveQuestion({ questionId: itemId, userId, path: pathname });
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    viewQuestion({ questionId: itemId, userId });
  }, [itemId, userId, pathname]);

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            onClick={() => handleVote("upvote")}
            className="cursor-pointer"
            src={hasupvoted ? "/assets/icons/upvoted.svg" : "/assets/icons/upvote.svg"}
            alt="upvote"
            width={18}
            height={18}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1 ">
            <p className="subtle-medium text-dark400_light900">{formatAndDivideNumber(upvotes || 0)}</p>
          </div>
        </div>

        {/* downvoted  */}
        <div className="flex-center gap-1.5">
          <Image
            className="cursor-pointer"
            src={hasdownvoted ? "/assets/icons/downvoted.svg" : "/assets/icons/downvote.svg"}
            alt="downvote"
            width={18}
            height={18}
            onClick={() => handleVote("downvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1 ">
            <p className="subtle-medium text-dark400_light900">{formatAndDivideNumber(downvotes || 0)}</p>
          </div>
        </div>
      </div>
      <Image
        className="cursor-pointer"
        onClick={handleSave}
        src={hasSaved ? "/assets/icons/star-filled.svg" : "/assets/icons/star-red.svg"}
        alt="star"
        width={18}
        height={18}
      />
    </div>
  );
};

export default Votes;
