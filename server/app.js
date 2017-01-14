const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const pr = require('./PoetryParser');
const pronouncing = require('pronouncing');
const app = express();




// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: false
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

app.post("/", function (req, res) {

    console.log(req.body.line_1);
    console.log(req.body.line_2);
    console.log(req.body.line_3);

    x = pr.cleanLine(String(req.body.line_1));
    y = pr.cleanLine(String(req.body.line_2));
    z = pr.cleanLine(String(req.body.line_3));

    console.log(x, y, z);

    x = pr.sounds(x);
    y = pr.sounds(y);
    z = pr.sounds(z);

    console.log(x, y, z);

    console.log(pronouncing.syllableCount(x), pronouncing.syllableCount(y), pronouncing.syllableCount(x));

    x = pr.stresses(x);
    y = pr.stresses(y);
    z = pr.stresses(z);

    console.log(x, y, z);

    res.send({
        x: x,
        y: y,
        z: z
    })
    });

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;