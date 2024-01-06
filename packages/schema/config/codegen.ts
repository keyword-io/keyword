import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './graphql/**/*.graphql',
  generates: {
    './generated/types.ts': {
      plugins: [
        {
          add: {
            content: `import PrismaClient, { PrismaPromise } from '@keyword/prisma-client';`,
          },
        },
        {
          add: {
            content: `export type ApolloServerContext = {\n  orm: PrismaClient;\n};`,
          },
        },
        'typescript',
        'typescript-resolvers',
      ],
      config: {
        contextType: '{ orm: PrismaClient; }',
        // customResolverFn: '(\n  parent: TParent,\n  args: TArgs,\n  context: TContext,\n  info: GraphQLResolveInfo\n) => PrismaPromise<TResult> | TResult;\n',
        scalars: {
          Date: 'Date',
          DateTime: 'Date',
          Json: '{ [key: string]: any }',
        },
      },
    },
    './generated/default.graphql': {
      plugins: ['schema-ast'],
    },
  },
};

export default config;
