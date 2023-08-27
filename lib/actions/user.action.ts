"use server"

// nextjs import
import { revalidatePath } from "next/cache";

// model import
import User from "../models/user.model";

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

export async function updateUser({ userId, username, name, bio, image, path }: Params): Promise<void> {
    connectToDB();

    try {
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
        console.log(`Failed to update/create user: ${error.message}`);
    }
}