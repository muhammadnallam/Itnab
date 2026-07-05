require("dotenv").config();
const { PrismaPg } = require("@prisma/adapter-pg"); // Prisma ORM's adapter for the use of node-postgres (pg)
const { PrismaClient } = require("@prisma/client");

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
module.exports = prisma;
