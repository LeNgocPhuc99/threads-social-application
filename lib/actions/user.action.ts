"use server"

// nextjs import
import { revalidatePath } from "next/cache";

// model import
import User from "../models/user.model";
import Thread from "../models/thread.model";

// libs import
import { connectToDB } from "../mongoose"
import { FilterQuery, SortOrder } from "mongoose";

interface UpdateUserParams {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string
}

interface FetchUserParams {
    userId: string;
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder
}

/**
 *  update user's profile
 * @param Params
 * 
 */
export async function updateUser({ userId, username, name, bio, image, path }: UpdateUserParams): Promise<void> {

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

export async function fetchUsers(
    { userId, searchString = "", pageNumber = 1, pageSize = 20, sortBy = "desc" }: FetchUserParams) {
    try {
        connectToDB();
        const skipAmount = (pageNumber - 1) * pageSize;

        const regex = new RegExp(searchString, "i");

        const query: FilterQuery<typeof User> = {
            id: { $ne: userId }
        }

        if (searchString.trim() !== '') {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } }
            ]
        }

        const sortOptions = { createdAt: sortBy }

        const usersQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        const totalUserQuery = await User.countDocuments(query);

        const users = await usersQuery.exec();

        const isNext = totalUserQuery > skipAmount + users.length;

        return { users, isNext }

    } catch (error: any) {
        throw new Error(`Failed to fetch uses: ${error.message}`)
    }
}