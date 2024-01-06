import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../schema/src/default.graphql',
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
