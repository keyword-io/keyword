import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

const Feed: React.FC<{
  value: string;
}> = props => {
  const { value } = props;
  const { t } = useTranslation();

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{t('feed.create_feed_title')}</CardTitle>
        <CardDescription>{t('feed.create_feed_desc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">{t('feed.name')}</Label>
              <Input
                id="name"
                placeholder="Name of your project"
                defaultValue={value}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">{t('feed.framework')}</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">{t('common.cancel')}</Button>
        <Button>{t('common.deploy')}</Button>
      </CardFooter>
    </Card>
  );
};

export default Feed;
