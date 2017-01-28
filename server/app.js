const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const pr = require('./poetryparser');
const pronouncing = require('pronouncing');
const app = express();
const natural = require('natural');

let Tagger = natural.BrillPOSTagger;
let baseFolder = './node_modules/natural/lib/natural/brill_pos_tagger';
let rules = baseFolder + '/data/English/tr_from_posjs.txt';
let lexicon = baseFolder + '/data/English/lexicon_from_posjs.json';
let defaultCategory = 'N';

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :stat' +
        'us :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// catches post on keyup and returns current syllable count for the line
app.post('/syllable_count', function (req, res) {
    syllables = pronouncing.syllableCount(
                pr.sounds(
                    pr.cleanLine(req.body.line)));
    console.log(syllables);
    res.send({
        syllables: syllables,
        name: req.body.name
    })
}),


app.post("/submit_haiku", function (req, res) {

    haiku = [
        req.body.line_1,
        req.body.line_2,
        req.body.line_3
        ];


    cleanHaiku = pr.runHaikuThrough(pr.cleanLine, haiku);

    let tagger = new Tagger(lexicon, rules, defaultCategory, function(err) {
        if (err) {
            console.log(err);
        } else {
            let one = tagger.tag(cleanHaiku[0]);
            let two = tagger.tag(cleanHaiku[1]);
            let three = tagger.tag(cleanHaiku[2]);


            one.map((pos) => {
                switch(pos[1]) {
                    case "N":
                    case "NN":
                    case "NNS":
                    case "NNP":
                    case "NNPS":
                    case "WP":
                    case "WP$":
                        console.log(pos[0] + " is a " + pos[1] + "!");
                        break;
                    case "JJ":
                    case "JJR":
                    case "JJS":
                    case "NN":
                        console.log(pos[0] + " is a " + pos[1] + "!");
                        break;
                    case "VB":
                    case "VBD":
                    case "VBG":
                    case "VBN":
                    case "VBP":
                    case "VBZ":
                        console.log(pos[0] + " is a " + pos[1] + "!");
                        break;
                    case "RB":
                    case "RBR":
                    case "RBS":
                        console.log(pos[0] + " is a " + pos[1] + "!");
                        break;
                    default:
                        console.log("not recognized yet, but " + pos[0] + " is a " + pos[1] + "!");
                }
            })
        }
    })

    soundsHaiku = pr.runHaikuThrough(pr.sounds, cleanHaiku);

    numSyllablesHaiku = pr.runHaikuThrough(pronouncing.syllableCount, soundsHaiku);

    stressHaiku = pr.runHaikuThrough(pr.stresses, soundsHaiku);

    newLineHaiku = pr.runHaikuThrough(pr.sameStress, stressHaiku);

    newRhymeHaiku = pr.runHaikuThrough(pr.sameRhymes, cleanHaiku);

    stressAndRhymeLists = pr.runHaikuThrough(pr.intersectTwoLines, newLineHaiku, newRhymeHaiku);

    // posList = pr.runHaikuThrough(pr.intersectTwoLines, newLineHaiku, newRhymeHaiku);

    stressAndRhymeHaiku = pr.runHaikuThrough(pr.randomWord, stressAndRhymeLists);

    finalHaiku = pr.runHaikuThrough(pr.removeUndefined, cleanHaiku, stressAndRhymeHaiku);

    res.send([
        [finalHaiku[0], finalHaiku[1], finalHaiku[2]],
        [numSyllablesHaiku[0], numSyllablesHaiku[1], numSyllablesHaiku[2]]
    ]);
}),

// Always return the main index.html, so react-router render the route in the
// client
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
}),

module.exports = app;