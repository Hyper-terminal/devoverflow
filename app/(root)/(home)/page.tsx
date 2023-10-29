import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <h1 className="h1-bold">
      <UserButton afterSignOutUrl="/" />
    </h1>
  );
}
