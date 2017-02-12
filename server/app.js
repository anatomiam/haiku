const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const pr = require('./PoetryParser');
const pronouncing = require('pronouncing');
const app = express();
const pos = require('pos');
const fs = require('fs');
const _ = require('lodash');

let tagger = new pos.Tagger();

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :stat' +
        'us :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '../react-ui/', './build')));

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

    soundsHaiku = pr.runHaikuThrough(pr.sounds, cleanHaiku);

    numSyllablesHaiku = pr.runHaikuThrough(pronouncing.syllableCount, soundsHaiku);

    stressHaiku = pr.runHaikuThrough(pr.stresses, soundsHaiku);

    newLineHaiku = pr.runHaikuThrough(pr.sameStress, stressHaiku);

    newRhymeHaiku = pr.runHaikuThrough(pr.sameRhymes, cleanHaiku);

    stressAndRhymeLists = pr.runHaikuThrough(pr.intersectTwoLines, newLineHaiku, newRhymeHaiku);


    // finalHaiku = pr.runHaikuThrough(pr.removeUndefined, cleanHaiku, stressAndRhymeHaiku);

    let tagged = cleanHaiku.map((line) => {
        return tagger.tag(line);
    })

   let taggedIntersection = tagged.map((line, t) => {
    //    console.log(line);
      return line.map((pos, i) => {

        switch(pos[1]) {
            case "N":
            case "NN":
            case "NNS":
            case "NNP":
            case "NNPS":
            case "WP":
            case "WP$":
                let text1 = pr.parseLibrary(
                                fs.readFileSync(
                                "./pos_word_files/nouns/"
                                + pronouncing.syllableCount(pronouncing.phonesForWord(pos[0][0])) 
                                + "syllablenouns.txt", {encoding: 'utf8'}));
                // console.log(pos[0] + " is a " + pos[1]);
                return xx1 = _.intersection(stressAndRhymeLists[t][i], text1);
                break;
            case "JJ":
            case "JJR":
            case "JJS":
                let text2 = pr.parseLibrary(
                                fs.readFileSync(
                                "./pos_word_files/adjectives/"
                                + pronouncing.syllableCount(pronouncing.phonesForWord(pos[0][0])) 
                                + "syllableadjectives.txt", {encoding: 'utf8'}));
                return xx2 = _.intersection(stressAndRhymeLists[t][i], text2);
                // console.log(xx2);
                break;
            case "VB":
            case "VBD":
            case "VBG":
            case "VBN":
            case "VBP":
            case "VBZ":
                let text3 = pr.parseLibrary(
                                fs.readFileSync(
                                "./pos_word_files/verbs/"
                                + pronouncing.syllableCount(pronouncing.phonesForWord(pos[0][0])) 
                                + "syllableverbs.txt", {encoding: 'utf8'}));
                // console.log(pronouncing.syllableCount(pronouncing.phonesForWord(pos[0])));
                return xx3 = _.intersection(stressAndRhymeLists[t][i], text3);
                // console.log(xx3);
                break;
            case "RB":
            case "RBR":
            case "RBS":
                let text4 = pr.parseLibrary(
                                fs.readFileSync(
                                "./pos_word_files/adverbs/"
                                + pronouncing.syllableCount(pronouncing.phonesForWord(pos[0][0])) 
                                + "syllableadverbs.txt", {encoding: 'utf8'}));
                return xx4 = _.intersection(stressAndRhymeLists[t][i], text4);
                // console.log(xx4);
                break;
            default:
                // console.log("not recognized yet, but " + pos[0] + " is a " + pos[1] + "!");
        }
    })
       })
    



    
    stressAndRhymeHaiku = pr.runHaikuThrough(pr.randomWord, stressAndRhymeLists);

    stressAndRhymeHaiku2 = pr.runHaikuThrough(pr.removeEmpty, cleanHaiku, stressAndRhymeHaiku);

    taggedIntersection2 = pr.runHaikuThrough(pr.randomWord, taggedIntersection);
                
    almostFinalHaiku = pr.runHaikuThrough(pr.removeEmpty, stressAndRhymeHaiku2, taggedIntersection2);

    finalHaiku = pr.runHaikuThrough(pr.removeUndefined, cleanHaiku, almostFinalHaiku);

        console.log("first: ", stressAndRhymeHaiku2[0],
                "second: ", stressAndRhymeHaiku2[1],
                "third: ", stressAndRhymeHaiku2[2]);
                
    res.send([
        [finalHaiku[0], finalHaiku[1], finalHaiku[2]],
        [numSyllablesHaiku[0], numSyllablesHaiku[1], numSyllablesHaiku[2]]
    ]);
}),

// Always return the main index.html, so react-router renders the route in the
// client
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
}),

module.exports = app;