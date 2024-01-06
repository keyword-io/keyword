import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { orm } from '@keyword/prisma-client';
import { ApolloServerContext } from '@keyword/schema';
import path from 'path';
import fs from 'fs';
import resolvers from './resolvers';
import { ServerLogger } from '@keyword/logger';
import {
  typeDefs as scalarTypeDefs,
  resolvers as scalarResolvers,
  DateTypeDefinition,
  DateResolver,
  DateTimeTypeDefinition,
  DateTimeResolver,
  JSONDefinition,
  JSONResolver,
} from 'graphql-scalars';

const SCHEMA_PATH = path.resolve(
  __dirname,
  '../../schema/generated/default.graphql'
);
const typeDefs = fs.readFileSync(SCHEMA_PATH, 'utf-8');

const server = new ApolloServer<ApolloServerContext>({
  typeDefs: [
    ...scalarTypeDefs,
    DateTypeDefinition,
    DateTimeTypeDefinition,
    JSONDefinition,
    typeDefs,
  ],
  resolvers: {
    ...scalarResolvers,
    Date: DateResolver,
    DateTime: DateTimeResolver,
    JSON: JSONResolver,
    ...resolvers,
  },
  logger: ServerLogger,
  formatError: (error: any) => {
    ServerLogger.error(error);
    return error;
  },
});

export default async function serve() {
  return await startStandaloneServer(server, {
    context: async () => ({
      orm,
    }),
    listen: {
      port: 4000,
    },
  });
}
