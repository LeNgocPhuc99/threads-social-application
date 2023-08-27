import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: { type: String, require: true },
    username: { type: String, require: true },
    name: { type: String, require: true },
    image: String,
    bio: String,
    // one user has many threads
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Thread"
        }
    ],
    onBoarded: {
        type: Boolean,
        default: false
    },
    // one user belongs many communities
    communities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Community"
        }
    ]
})

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User