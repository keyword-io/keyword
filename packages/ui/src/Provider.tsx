import React, { useEffect } from 'react';
import { client } from './graphql/client';
import { ApolloProvider } from '@apollo/client';
import { getDefaultLanguage } from './i18n/index';
import { useLocalStorage } from 'react-use';
import { useTranslation } from 'react-i18next';

const Provider: React.FC<{
  children?: React.ReactNode;
}> = props => {
  const { children } = props;
  const { i18n } = useTranslation();
  const [language] = useLocalStorage('language', getDefaultLanguage());

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language).then();
    }
  }, [i18n, language]);

  return (
    <ApolloProvider client={client}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child);
        }
        return child;
      })}
    </ApolloProvider>
  );
};

export default Provider;
