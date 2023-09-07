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