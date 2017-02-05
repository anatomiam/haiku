const pronouncing = require('pronouncing');
const _ = require('lodash');
const pos = require('pos');
var fs = require('fs');


let tagger = new pos.Tagger();

// takes a string input, splits it into an array of lowercased words
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

// takes an array of words, creates an array of the phonetic translation
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

// takes an array of phonetic translations, returns an array of the syllabic stress pattern
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

// takes an array of stress patterns, returns an array of arrays of words that have the same stress pattern 
exports.sameStress = (stresses) => {
    let sameStress = [];

    stresses.map((stress) => {
        sameStress.push(pronouncing.searchStresses(stress));
    })

    return sameStress;
}

// takes an array of words, returns an array of arrays of words that rhyme for each
exports.sameRhymes = (words) => {
    let wordRhymes = [];

    words.map((word) => {
        wordRhymes.push(pronouncing.rhymes(word));
    })

    return wordRhymes;
}

// takes an array of arrays, takes common words between each inside array
exports.intersectTwoLines = (array1, array2) => {
    let intersected = [];
    
    array1.map((words, i) => {
        intersected.push(_.intersection(words, array2[i]));
    })

    return intersected;
}

exports.intersectLineWithPOSLibrary = (line, library) => {
    return line.map((word) => {
        _.intersection(word, library);
    })
}

// takes array of arrays, return random for each inside array 
exports.randomWord = (line) => {
    let newLine = []
    if (line != undefined)
        line.map((words) => {
            if (words != undefined) {
            newLine.push(words[_.random(words.length)])
            }
        });

    return newLine
}

// takes the original array of words and the array of newly generated words
// if there is a word that doesn't have the same stress pattern and rhyme, it will return undefined. this function
// replaces undefined with the original word
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


// takes a function, and one or two arrays of arrays, maps each array through the function and returns and array of arrays
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

// takes a file path to list of words and returns an array of each word in the file
exports.parseLibrary = (library) => {
    words = [];
    _.forEach(library.split("\n"), (word) => {
        if (word.length == 0) { return; }
        else { words.push(word.replace(/[\r]/g, '')) }
    })
    return words;
}

exports.posHaiku = (taggedLines) => {

    partsOfSpeech = [];

    taggedLines.map((line) => {
        partsOfSpeech.push(
            line.map((pos, i) => {
        switch(pos[1]) {
            case "N":
            case "NN":
            case "NNS":
            case "NNP":
            case "NNPS":
            case "WP":
            case "WP$":
                let text1 = exports.parseLibrary(
                                fs.readFileSync(
                                __dirname + "/pos_word_files/nouns/"
                                + pronouncing.syllableCount(pronouncing.phonesForWord(pos[0][0])) 
                                + "syllablenouns.txt", {encoding: 'utf8'}));
                return xx1 = _.intersection(stressAndRhymeLists[0][i], text1);
                // console.log(xx1);
                break;
            case "JJ":
            case "JJR":
            case "JJS":
                let text2 = exports.parseLibrary(
                                fs.readFileSync(
                                __dirname + "/pos_word_files/adjectives/"
                                + pronouncing.syllableCount(pronouncing.phonesForWord(pos[0][0])) 
                                + "syllableadjectives.txt", {encoding: 'utf8'}));
                return xx2 = _.intersection(stressAndRhymeLists[0][i], text2);
                // console.log(xx2);
                break;
            case "VB":
            case "VBD":
            case "VBG":
            case "VBN":
            case "VBP":
            case "VBZ":
                let text3 = exports.parseLibrary(
                                fs.readFileSync(
                                __dirname + "/pos_word_files/verbs/"
                                + pronouncing.syllableCount(pronouncing.phonesForWord(pos[0][0])) 
                                + "syllableverbs.txt", {encoding: 'utf8'}));
                // console.log(pronouncing.syllableCount(pronouncing.phonesForWord(pos[0])));
                return xx3 = _.intersection(stressAndRhymeLists[0][i], text3);
                // console.log(xx3);
                break;
            case "RB":
            case "RBR":
            case "RBS":
                let text4 = exports.parseLibrary(
                                fs.readFileSync(
                                __dirname + "/pos_word_files/adverbs/"
                                + pronouncing.syllableCount(pronouncing.phonesForWord(pos[0][0])) 
                                + "syllableadverbs.txt", {encoding: 'utf8'}));
                return xx4 = _.intersection(stressAndRhymeLists[0][i], text4);
                // console.log(xx4);
                break;
            default:
                console.log("not recognized yet, but " + pos[0] + " is a " + pos[1] + "!");
    }}))})}
