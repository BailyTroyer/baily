/**
 * In development, the command next dev clears Node.js cache on run.
 *
 * This in turn initializes a new PrismaClient instance each time due
 * to hot reloading that creates a connection to the database.
 *
 * This can quickly exhaust the database connections as each PrismaClient
 * instance holds its own connection pool.
 *
 * @also @see https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */

import { PrismaClient } from "@prisma/client";

const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};

export const prisma: PrismaClient =
  prismaGlobal.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  prismaGlobal.prisma = prisma;
}
