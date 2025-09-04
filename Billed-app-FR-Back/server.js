const app = require('./app');

const PORT = process.env.PORT || 5678;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Bill app backend listening on port ${PORT}!`);
});
