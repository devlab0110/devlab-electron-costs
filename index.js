const app   = require('devlab-electron-app');
const setup = require('./setup');

async function bootstrap() {
  const obj = new app(setup);
  await obj.start();
}
bootstrap();