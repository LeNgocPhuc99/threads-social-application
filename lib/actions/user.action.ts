"use server"

// nextjs import
import { revalidatePath } from "next/cache";

// model import
import User from "../models/user.model";
import Thread from "../models/thread.model";

// libs import
import { connectToDB } from "../mongoose"

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string
}

/**
 *  update user's profile
 * @param Params
 * 
 */
export async function updateUser({ userId, username, name, bio, image, path }: Params): Promise<void> {

    try {
        // connect to database
        connectToDB();

        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLocaleLowerCase(),
                name,
                bio,
                image,
                onBoarded: true
            },
            {
                upsert: true // update existing row || insert new row if not exist
            })

        if (path === '/profile/edit') {
            revalidatePath(path)
        }
    } catch (error: any) {
        throw new Error(`Failed to update/create user: ${error.message}`)
    }
}

/**
 * Get user by id
 * @param userId 
 */
export async function fetchUser(userId: string) {
    try {
        // connect to database
        connectToDB();

        return await User.findOne({ id: userId })

    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`)
    }
}

export async function fetchUserPosts(userId: string) {
    try {
        connectToDB();

        // Find all threads authored by user with the given userId

        // TODO: populate community
        const threads = await User.findOne({ id: userId })
            .populate({
                path: 'threads',
                model: Thread,
                populate: {
                    path: 'author',
                    model: User,
                    select: 'name image id'
                }
            })

        return threads;
    } catch (error: any) {
        throw new Error(`Failed to fetch user posts: ${error.message}`)
    }
}