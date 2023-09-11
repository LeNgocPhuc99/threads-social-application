// next import
import { redirect } from "next/navigation";

// clerk import
import { currentUser } from "@clerk/nextjs";

// libs import
import { fetchUser } from "@/lib/actions/user.action";

// components import
import PostThread from "@/components/forms/PostThread";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onBoarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text">Create Thread</h1>
      <PostThread userId={JSON.stringify(userInfo._id)} />
    </>
  );
}

export default Page;
