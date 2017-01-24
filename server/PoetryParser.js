const pronouncing = require('pronouncing');
const _ = require('lodash');
const natural = require('natural');

let Tagger = natural.BrillPOSTagger;
let baseFolder = './node_modules/natural/lib/natural/brill_pos_tagger';
let rules = baseFolder + '/data/English/tr_from_posjs.txt';
let lexicon = baseFolder + '/data/English/lexicon_from_posjs.json';
let defaultCategory = 'N';

exports.cleanLine = (line) => {
    let words = [];
    line.trim()
        .toLowerCase()
        .split(" ")
        .map((word) => {
            words.push(word.replace(/[^A-Za-z0-9]+/g, ''))
        });
    return words;
}

exports.sounds = (words) => {
    let sounds = [];
    words.map((word) => {
        if (word === ' ') {
            sounds.push(word);
        } else {
            sound = pronouncing.phonesForWord(word);
            if (sound.length == 0) {
                sounds.push('_');
            } else {
                sounds.push(sound[0]);
            }
        }
    })
    return sounds;
}

exports.stresses = (sounds) => {
    let stresses = [];
    sounds.map((sound) => {
        if (sound == ' ' || sound == '_') {
            stresses.push(sound);
        } else {
            stresses.push(pronouncing.stresses(sound));
        }
    })
    return stresses;
}

exports.sameStress = (stresses) => {
    let sameStress = [];
    let newLine = []
    stresses.map((stress) => {
        sameStress.push(pronouncing.searchStresses(stress));
    })

    return sameStress;
}

exports.sameRhymes = (words) => {
    let wordRhymes = [];
    let newLine = [];

    words.map((word) => {
        wordRhymes.push(pronouncing.rhymes(word));
    })

    return wordRhymes;
}

exports.sameStressAndRhyme = (stressWords, rhymeWords) => {
    let options = [];
    let newOptions = [];
    let newLines = [];
    
    stressWords.map((stresses, i) => {
        options.push(_.intersection(stresses, rhymeWords[i]));
    })
    options.map((option) => {
        newLines.push(option[Math.floor(Math.random() * option.length)]);
    })

    return newLines;
}

exports.removeUndefined = (original, generated) => {
    newest = []
    generated.map((word, i) => {
        if (word == undefined) {
            newest.push(original[i]);
        } else {
            newest.push(word);
        }
    })
    return newest;
}

exports.tagLine = (line) => {
    let tagger = new Tagger(lexicon, rules, defaultCategory, function(err) {
    if (err) {
        console.log(err);
        }
    })
    return tagger.tag(line);
}

exports.runHaikuThrough = (func, haiku, haiku2 = false) => {
    lines = [];
    if (haiku2 === false) {
        haiku.map((line) => {
            lines.push(func(line));
        })
    } else {
        haiku.map((line, i) => {
            lines.push(func(line, haiku2[i]));
        })
    }
    return lines;
}
