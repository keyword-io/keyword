import server from './server';

server().then(({ url }) => {
  console.log(`Server ready at: ${url}`);
});
