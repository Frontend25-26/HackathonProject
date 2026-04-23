"use server"
import { signIn } from "@/features/auth/authSetup"

export async function loginWithGithub() {
    await signIn("github", {
        redirectTo: "/",
    })
}