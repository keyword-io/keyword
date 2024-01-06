import { MutationResolvers } from '@keyword/schema';

const createFeed: NonNullable<MutationResolvers['createFeed']> = async (
  parent,
  args,
  context,
  info
) => {
  const { orm } = context;
  const { data } = args;

  const createTime = new Date().toISOString();

  const feed = await orm.feed.create({
    data: {
      ...data,
      create_time: createTime,
      update_time: createTime,
    },
  });

  return feed;
};

export default {
  createFeed,
};
