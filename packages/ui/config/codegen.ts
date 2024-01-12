import type { CodegenConfig } from '@graphql-codegen/cli';
const schema = require.resolve('@keyword/schema/generated/default.graphql');

const config: CodegenConfig = {
  schema: schema,
  documents: './src/graphql/*.graphql',
  generates: {
    './src/generated/react-hooks.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withComponent: false,
        withHOC: false,
        withHooks: true,
        maybeValue: 'T | null | undefined',
      },
    },
  },
};

export default config;
