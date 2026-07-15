import prisma from "../lib/prisma.js";

class User {
    async findByEmail(email) {
        const user = await prisma.user.findUnique({
            where: {email: email}
        })

        return user;
    }

    async findByUsername(username) {
        const user = await prisma.user.findUnique({
            where: {username: username}
        })
    }

    async add(username, email, password) {
        await prisma.user.create({
            data: {username: username, email: email, password: password, name: "مجهول"}
        })
    }

    async remove(userId) {
        await prisma.user.delete({
            where: {userId: userId}
        })
    }
}

export default User;
