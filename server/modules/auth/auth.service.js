import { auth } from "../../lib/auth.js";

export async function signUp(email, password) {
    const data = await auth.api.signUpEmail({
        body: {
            email: email,
            password: password,
        },
    });
}

export async function signIn(email, password) {
    const data = await auth.api.signInEmail({
        body: {
            email: email,
            password: password,
            rememberMe: true,
        },
        headers: await headers(),
    });
}

export async function signOut() {
    await auth.api.signOut({
        headers: await headers(),
    });
}
