import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = env("DATABASE_URL");

export default defineConfig({
  datasource: {
    url: connectionString,
  },
});

