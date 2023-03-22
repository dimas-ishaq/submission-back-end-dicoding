const Hapi = require('@hapi/hapi');
const route = require('./routes');

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
  });
  // create server route
  server.route(route);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
