import React from 'react';
import Feed from './Feed';
import { useGetFeedsListQuery } from '@/generated/react-hooks.ts';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectTrigger,
} from '@/components/ui/select.tsx';
import { SupportLanguage } from '@keyword/i18n';
import { useTranslation } from 'react-i18next';

const FeedList: React.FC = () => {
  const { data } = useGetFeedsListQuery();
  const { i18n } = useTranslation();

  return (
    <div>
      <Select
        value={i18n.language}
        onValueChange={value => i18n.changeLanguage(value)}
      >
        <SelectTrigger id="i18n-language">
          <SelectValue placeholder="Select Languge" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={SupportLanguage.zh}>zh_CN</SelectItem>
          <SelectItem value={SupportLanguage.en}>en_US</SelectItem>
        </SelectContent>
      </Select>
      {data?.feeds.map(feed => <Feed key={feed.id} value={feed.title} />)}
    </div>
  );
};

export default FeedList;
