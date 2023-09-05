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