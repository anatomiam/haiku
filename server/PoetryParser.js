const pronouncing = require('pronouncing');
const _ = require('lodash');

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
    let newLine = []
    stresses.map((stress) => {
        sameStress.push(pronouncing.searchStresses(stress));
    })

    return sameStress;
}

// takes an array of words, returns an array of arrays of words that rhyme for each
exports.sameRhymes = (words) => {
    let wordRhymes = [];
    let newLine = [];

    words.map((word) => {
        wordRhymes.push(pronouncing.rhymes(word));
    })

    return wordRhymes;
}

// takes the results of sameStress and sameRhyme and returns the common words between the arrays 
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


exports.parseLibrary = (library) => {
    words = [];
    _.forEach(library.split("\n"), (word) => {
        if (word.length == 0) { return; }
        else { words.push(word) }
    })
    return words;
}
