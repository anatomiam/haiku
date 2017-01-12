const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const spawn = require('child_process').spawn;
const processx = spawn("python", ["python/poetryparser.py"]);
const util = require('util');
const poetryparser = require('./PoetryParser');

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
//     // Handle normal output
// processx.stdout.on('data', (data) => {
//     console.log(String.fromCharCode.apply(null, data));
//     });
    console.log(req.body.line_1);
    console.log(req.body.line_2);
    console.log(req.body.line_3);

    x = poetryparser(String(req.body.line_1));

    console.log(x);
    // Write data (remember to send only strings or numbers, otherwhise python wont understand)
    // var data = JSON.stringify("Hello World There Are None");
    // processx.stdin.write(data);
    // End data write
    // processx.stdin.end();
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
    });

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;