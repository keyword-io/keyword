import { Resolvers } from '@keyword/schema';

import feedResolvers from './feed';

const resolvers: Resolvers = {
  Query: {
    ...feedResolvers.queries,
  },
  Mutation: {
    ...feedResolvers.mutations,
  },
};

export default resolvers;
