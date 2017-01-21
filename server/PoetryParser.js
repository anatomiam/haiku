const pronouncing = require('pronouncing');

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

function intersection_destructive(a, b) {
    let result = [];
    while (a.length > 0 && b.length > 0) {
        if (a[0] < b[0]) {
            a.shift();
        } else if (a[0] > b[0]) {
            b.shift();
        } else /* they're equal */
        {
            result.push(a.shift());
            b.shift();
        }
    }
    return result;
}

exports.sameStressAndRhyme = (stressWords, rhymeWords) => {
    let options = [];
    let newOptions = [];
    let newLines = [];
    let i = 0;
    
    stressWords.map((stresses) => {
        options.push(intersection_destructive(stresses, rhymeWords[i]));
        i++;
    })
    options.map((option) => {
        newLines.push(option[Math.floor(Math.random() * option.length)]);
    })

    return newLines;
}

exports.removeUndefined = (original, generated) => {
    newest = []
    let i = 0;
    generated.map((word) => {
        if (word == undefined) {
            newest.push(original[i]);
        } else {
            newest.push(word);
        }
        i++;
    })
    return newest;
}

exports.runHaikuThrough = (func, haiku, haiku2 = false) => {
    lines = [];
    if (haiku2 === false) {
        haiku.map((line) => {
            lines.push(func(line));
        })
    } else {
        i = 0;
        haiku.map((line) => {
            lines.push(func(line, haiku2[i]));
            i++;
        })
    }
    return lines;
}
