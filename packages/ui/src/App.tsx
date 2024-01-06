import React from 'react';
import Provider from './Provider.tsx';
import FeedList from '@/pages/Feed/FeedList.tsx';

function App() {
  return (
    <Provider>
      <FeedList />
    </Provider>
  );
}

export default App;
