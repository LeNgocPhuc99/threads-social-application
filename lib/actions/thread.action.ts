"use server"

// nextjs import
import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose"

import User from "../models/user.model";
import Thread from "../models/thread.model"


interface Params {
    text: string,
    author: string,
    communityId: string,
    path: string
}

export async function createThread({ text, author, communityId, path }: Params) {
    try {
        connectToDB();

        const createdThread = await Thread.create({
            text,
            author,
            communityId: null
        });

        // Update User Model
        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id }
        })

        revalidatePath(path)

    } catch (error: any) {
        console.log(`Failed to create thread: ${error.message}`)

        throw new Error(`Failed to create thread: ${error.message}`)
    }


}

export async function fetchThreads(pageNumber = 1, pageSize = 20) {
    try {
        connectToDB();

        // calculate the number of posts to skip
        const skipAmount = (pageNumber - 1) * pageSize;

        // Fetch the posts that have no parent
        const threadQuery = Thread.find({
            parentId: {
                $in: [null, undefined]
            }
        })
            .sort({ createAt: 'desc' })
            .skip(skipAmount)
            .limit(pageSize)
            .populate({ path: 'author', model: User })
            .populate({
                path: 'children',
                populate: {
                    path: 'author',
                    model: User,
                    select: "_id name parentId image"
                }
            })

        const totalPostCount = await Thread.countDocuments({
            parentId: {
                $in: [null, undefined]
            }
        })

        const threads = await threadQuery.exec();

        const isNext = totalPostCount > skipAmount + threads.length;

        return { threads, isNext }

    } catch (error: any) {
        throw new Error(`Failed to fetch threads`)
    }
}

export async function fetchThreadById(id: string) {
    try {
        connectToDB();
        // TODO: Populate Community
        const thread = await Thread.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: "_id id name image"
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: '_id id name parentId image'
                    },
                    {
                        path: 'children',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: "_id id name parenId image"
                        }
                    }
                ]
            }).exec();

        return thread;

    } catch (error: any) {
        throw new Error(`Error fetching thread: ${error.message}`)
    }
}

export async function addCommentToThreads(threadId: string, commentText: string, userId: string, path: string) {
    try {
        connectToDB();

        // find the original thread by its Id
        const originalThread = await Thread.findById(threadId);
        if (!originalThread) {
            throw new Error("Thread not found");
        }

        // create a new thread with the comment text
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId
        })

        // save new thread
        const savedCommentThread = await commentThread.save();

        // update the original thread to include the new comment
        originalThread.children.push(savedCommentThread._id)

        // save original thread
        originalThread.save();

        revalidatePath(path);

    } catch (error: any) {
        throw new Error(`Error adding comment to thread: ${error.message}`)
    }
}