import "dotenv/config";
import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

export default defineConfig({
  ...(connectionString && {
    datasource: {
      url: connectionString,
    },
  }),
});

