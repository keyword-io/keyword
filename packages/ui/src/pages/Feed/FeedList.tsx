import React from 'react';
import Feed from './Feed';

const FeedList: React.FC<{}> = props => {
  return (
    <div>
      {['button-1', 'button-2'].map(id => (
        <Feed key={id} value={id} />
      ))}
    </div>
  );
};

export default FeedList;
