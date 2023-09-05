"use client";

// nextjs import
import { usePathname, useRouter } from "next/navigation";

// third-party libs import
import * as z from "zod";

// shahcn component import
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// ui components import
import { Textarea } from "../ui/textarea";

// hooks import
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// libs import
import { ThreadValidation } from "@/lib/validations/thread";
import { updateUser } from "@/lib/actions/user.action";
import { createThread } from "@/lib/actions/thread.action";

type Props = {
  userId: string;
};

const PostThread = ({ userId }: Props) => {
  const router = useRouter();
  const pathName = usePathname();

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });

  // text, author, communityId, path
  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    await createThread({
      text: values.thread,
      author: userId,
      communityId: "",
      path: pathName,
    });

    router.push("/");
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-start gap-10 mt-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">
          Post Thread
        </Button>
      </form>
    </Form>
  );
};

export default PostThread;
