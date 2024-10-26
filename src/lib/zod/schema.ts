import { db } from "$lib/db/database";
import { type SelectUser, users } from "$lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import zxcvbn from "zxcvbn";

export const userCreateSchema = z.object({
    firstName: z.string().min(1, { message: "You can't not have a name?" }),
    lastName: z.string().min(1, { message: "You must have a last name" }),
    email: z.string().email(),
    password: z.string().min(10),
    confirmPassword: z.string().min(10)
}).superRefine(({ password, confirmPassword }, ctx) => {
    const result = zxcvbn(password);
    if (result.score < 3) {
        ctx.addIssue({
            code: "custom",
            message: "Passwords not strong enough, please work out a bit.",
            path: ["password"]
        });
    }
    if (password !== confirmPassword) {
        ctx.addIssue({
            code: "custom",
            message: "Passwords must match",
            path: ["confirmPassword"]
        });
    }
});

export const userLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(10),
}).superRefine(async ({ email }, ctx) => {
});

export const userResetSchema = z.object({
    email: z.string().email(),
}).superRefine(async ({ email }, ctx) => {
    const user: SelectUser = (await db.select().from(users).where(eq(users.email, email)))[0];

    if (!user) {
        ctx.addIssue({
            code: "custom",
            message: "User with this email doesn't exist.",
            path: ["email"]
        })
    }
});

export const verifyEmailSchema = z.object({
    code: z.string().min(6).max(6),
    userId: z.string(),
}).superRefine(async ({ userId }, ctx) => {
    const user: SelectUser = (await db.select().from(users).where(eq(users.id, userId)))[0];

    if (!user) {
        ctx.addIssue({
            code: "custom",
            message: "User with this id doesn't exist.",
            path: ["email"]
        })
    }
});
