import { QueryResolvers } from '@keyword/schema';

const getFeedList: NonNullable<QueryResolvers['feeds']> = async (
  parent,
  args,
  context,
  info
) => {
  const { id, title, content } = args.where || {};

  // FIXME @junjia: imple get list
  const feeds = await context.orm.feed.findMany({
    where: {
      id: id || undefined,
      title: title || undefined,
      content: content || undefined,
    },
  });
  return feeds;
};

const getFeedOne: NonNullable<QueryResolvers['feed']> = async (
  parent,
  args,
  context,
  info
) => {
  const { id } = args.where || {};

  // FIXME @junjia: imple get one
  const feed = await context.orm.feed.findUnique({
    where: {
      id: id || undefined,
    },
  });
  return feed;
};

export default {
  feeds: getFeedList,
  feed: getFeedOne,
};
