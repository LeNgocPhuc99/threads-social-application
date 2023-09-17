// nextjs import
import { redirect } from "next/navigation";

// libs import
import { fetchUser, fetchUsers } from "@/lib/actions/user.action";

// clerk import
import { currentUser } from "@clerk/nextjs";

// component import
import UserCard from "@/components/cards/UserCard";

const Page = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onBoarded) redirect("/onboarding");

  const result = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      {/* Search Bar */}
      <div className="mt-14 flex flex-col gap-9">
        {result.users.length === 0 ? (
          <p className="no-result">No users</p>
        ) : (
          <>
            {result.users.map((user) => (
              <UserCard
                key={user.id}
                id={user.id}
                name={user.name}
                username={user.username}
                imgUrl={user.image}
                personType="User"
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Page;
