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

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.post("/", function (req, res) {

    haiku = [
        req.body.line_1,
        req.body.line_2,
        req.body.line_3
        ];

    cleanHaiku = pr.runHaikuThrough(pr.cleanLine, haiku);

    soundsHaiku = pr.runHaikuThrough(pr.sounds, cleanHaiku);

    numSyllablesHaiku = pr.runHaikuThrough(pronouncing.syllableCount, soundsHaiku);

    stressHaiku = pr.runHaikuThrough(pr.stresses, soundsHaiku);

    newLineHaiku = pr.runHaikuThrough(pr.sameStress, stressHaiku);

    newRhymeHaiku = pr.runHaikuThrough(pr.sameRhymes, cleanHaiku);

    stressAndRhymeHaiku = pr.runHaikuThrough(pr.sameStressAndRhyme, newLineHaiku, newRhymeHaiku);

    finalHaiku = pr.runHaikuThrough(pr.removeUndefined, cleanHaiku, stressAndRhymeHaiku);

    res.send({
        final_1: finalHaiku[0],
        final_2: finalHaiku[1],
        final_3: finalHaiku[2],
        num_syllables_1: numSyllablesHaiku[0],
        num_syllables_2: numSyllablesHaiku[1],
        num_syllables_3: numSyllablesHaiku[2]
    });
}),

// Always return the main index.html, so react-router render the route in the
// client
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
}),

module.exports = app;