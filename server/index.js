'use strict';

const app = require('./app');
const pr = require('pronouncing');

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
//   console.log(`App listening on port ${PORT}!`);
console.log(pr.rhymes("sinking"));
});