// I'm wondering what you could have done to get all your tests passing. For example, if you can't predict the exact response you'd expect, you can predict the keys that the response should have.

require('dotenv').config();
require('./lib/client').connect();

const app = require('./lib/app');

const PORT = process.env.PORT || 7890;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

