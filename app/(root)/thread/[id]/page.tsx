// next import
import { redirect } from "next/navigation";

// clerk import
import { currentUser } from "@clerk/nextjs";

// components import
import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";

// libs import
import { fetchUser } from "@/lib/actions/user.action";
import { fetchThreadById } from "@/lib/actions/thread.action";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onBoarded) redirect("/onboarding");

  const thread = await fetchThreadById(params.id);

  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={user?.id!}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createAt={thread.createAt}
          comments={thread.children}
        />
      </div>
      <div className="mt-7">
        <Comment
          threadId={thread.id}
          currentUserId={JSON.stringify(userInfo._id)}
          currentUserImg={userInfo.image}
        />
      </div>

      <div className="mt-10">
        {thread.children.map((childrenItem: any) => (
          <ThreadCard
            key={childrenItem._id}
            id={childrenItem._id}
            currentUserId={childrenItem?.id!}
            parentId={childrenItem.parentId}
            content={childrenItem.text}
            author={childrenItem.author}
            community={childrenItem.community}
            createAt={childrenItem.createAt}
            comments={childrenItem.children}
            isComment={true}
          />
        ))}
      </div>
    </section>
  );
};

export default Page;
