"use client";

// nextjs import
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

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
import { Input } from "../ui/input";

// hooks import
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// libs import
import { CommentValidation } from "@/lib/validations/thread";
import { addCommentToThreads } from "@/lib/actions/thread.action";

interface Props {
  threadId: string;
  currentUserId: string;
  currentUserImg: string;
}

const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {
  const router = useRouter();
  const pathName = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  // text, author, communityId, path
  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToThreads(
      threadId,
      values.thread,
      JSON.parse(currentUserId),
      pathName
    );

    form.reset();
  };
  return (
    <Form {...form}>
      <form className="comment-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex gap-3 items-center w-full">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="Profile Image"
                  className="rounded-full object-cover"
                  width={48}
                  height={48}
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Comment..."
                  className="no-focus text-light-1 outline-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="comment-form-btn">
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
