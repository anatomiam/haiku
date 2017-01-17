const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const pr = require('./PoetryParser');
const pronouncing = require('pronouncing');
const app = express();

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :stat' +
        'us :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({extended: false}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

app.post("/", function (req, res) {

    console.log(req.body.line_1);
    console.log(req.body.line_2);
    console.log(req.body.line_3);

    clean_line_1 = pr.cleanLine(String(req.body.line_1));
    clean_line_2 = pr.cleanLine(String(req.body.line_2));
    clean_line_3 = pr.cleanLine(String(req.body.line_3));

    // console.log(clean_line_1, clean_line_2, clean_line_3);

    sounds_line_1 = pr.sounds(clean_line_1);
    sounds_line_2 = pr.sounds(clean_line_2);
    sounds_line_3 = pr.sounds(clean_line_3);

    // console.log('sounds line', sounds_line_1);

    num_syllables_1 = pronouncing.syllableCount(sounds_line_1);
    num_syllables_2 = pronouncing.syllableCount(sounds_line_2);
    num_syllables_3 = pronouncing.syllableCount(sounds_line_3);

    // console.log('num syll', num_syllables_1);

    stresses_line_1 = pr.stresses(sounds_line_1);
    stresses_line_2 = pr.stresses(sounds_line_2);
    stresses_line_3 = pr.stresses(sounds_line_3);

    // console.log('stresses', stresses_line_1);

    newLine_1 = pr.sameStress(stresses_line_1);
    newLine_2 = pr.sameStress(stresses_line_2);
    newLine_3 = pr.sameStress(stresses_line_3);

    newRhyme_1 = pr.sameRhymes(clean_line_1);
    newRhyme_2 = pr.sameRhymes(clean_line_2);
    newRhyme_3 = pr.sameRhymes(clean_line_3);

    // console.log('new line', newLine_1, '\nnew rhyme', newRhyme_1);
    // console.log(newLine_2, newRhyme_2); console.log(newLine_3, newRhyme_3);

    stressAndRhyme_1 = pr.sameStressAndRhyme(newLine_1, newRhyme_1);
    stressAndRhyme_2 = pr.sameStressAndRhyme(newLine_2, newRhyme_2);
    stressAndRhyme_3 = pr.sameStressAndRhyme(newLine_3, newRhyme_3);

    console.log(stressAndRhyme_1);
    console.log(stressAndRhyme_2);
    console.log(stressAndRhyme_3);

    final_1 = pr.removeUndefined(clean_line_1, stressAndRhyme_1);
    final_2 = pr.removeUndefined(clean_line_2, stressAndRhyme_2);
    final_3 = pr.removeUndefined(clean_line_3, stressAndRhyme_3);

    console.log(final_1);
    console.log(final_2);
    console.log(final_3);

    res.send({
        final_1: final_1,
        final_2: final_2, 
        final_3: final_3,
        num_syllables_1: num_syllables_1,
        num_syllables_2: num_syllables_2,
        num_syllables_3: num_syllables_3
    })
});

// Always return the main index.html, so react-router render the route in the
// client
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;