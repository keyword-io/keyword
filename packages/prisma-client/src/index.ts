import { PrismaClient as BasePrismaClient } from '../prisma/client';

export { PrismaPromise, Prisma } from '../prisma/client';

export default class PrismaClient extends BasePrismaClient {}

export const orm = new PrismaClient();
