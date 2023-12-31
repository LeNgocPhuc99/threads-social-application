// nextjs import
import { redirect } from "next/navigation";

// clerk import
import { currentUser } from "@clerk/nextjs";

// libs import
import { fetchUser } from "@/lib/actions/user.action";

// component import
import AccountProfile from "@/components/forms/AccountProfile";

// type import
import { User } from "@/types";

async function Page() {
  const user = await currentUser();
  if (!user) return;

  const userInfo = await fetchUser(user.id);
  if (userInfo?.onBoarded) redirect("/");

  // id: string;
  // objectId: string;
  // username: string;
  // bio: string;
  // image: string;
  const userData: User = {
    id: user?.id || "1",
    objectId: user?.id || "1",
    name: user?.firstName || "test user",
    username: user?.username || "test_user",
    bio: "",
    image: user?.imageUrl || "",
  };
  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now to use Threads
      </p>
      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile user={userData} btnTitle="" />
      </section>
    </main>
  );
}

export default Page;
