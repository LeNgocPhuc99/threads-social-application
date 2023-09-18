// nextjs import
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

// libs import
import { fetchUser, getActivity } from "@/lib/actions/user.action";

// clerk import
import { currentUser } from "@clerk/nextjs";

const Page = async () => {
  const user = await currentUser();
  if (!user) return;

  const userInfo = await fetchUser(user.id);
  if (!userInfo) return;

  // getActivity
  const activities = await getActivity(userInfo._id);

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <Link key={activity._id} href={`/thread/${activity.parentId}`}>
              <article className="activity-card">
                <Image
                  src={activity.author.image}
                  alt="Profile Picture"
                  className="rounded-full object-cover"
                  width={40}
                  height={40}
                />
                <p className="!text-small-regular text-light-1">
                  <span className="mr-1 text-primary-500">
                    {activity.author.name}
                  </span>{" "}
                  replied your thread
                </p>
              </article>
            </Link>
          ))
        ) : (
          <p className="!text-base-regular text-light-3">No activity yet</p>
        )}
      </section>
    </section>
  );
};

export default Page;
