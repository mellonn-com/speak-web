import type { Config } from "drizzle-kit";

export default {
    driver: "mysql2",
    schema: "./db/schema.ts",
    out: "./db/drizzle",
} satisfies Config;
