import { Button } from "../ui/button";

interface RenderTagProps {
  _id: string | number;
  name: string;
}

const RenderTag = ({ _id, name }: RenderTagProps) => {
  return (
    <Button
      key={_id}
      className={`small-medium w-fit max-w-[150px] text-ellipsis rounded-lg bg-light-800 px-5 
            capitalize text-light-500 shadow-sm  hover:bg-light-800 dark:bg-dark-300
         dark:text-light-500`}
    >
      {name}
    </Button>
  );
};

export default RenderTag;
