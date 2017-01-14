const pronouncing = require('pronouncing');

exports.cleanLine = function(line) {
    var no_white_space = line.trim()
    var lower_line = no_white_space.toLowerCase();
    var split_line = lower_line.split(" ");
    var words = [];
    for (var i=0;i<split_line.length;i++) {
        words.push(split_line[i].replace(/[^A-Za-z0-9]+/g, ''))
    }
    return words;
}

exports.sounds = function(words) {
    var sounds = [];
    words.map(function(word) {
        if (word === ' ') {
            sounds.push(word);
        }
        else {
            sound = pronouncing.phonesForWord(word);
            if (sound.length == 0) {
                sounds.push('*');
            }
            else {
                sounds.push(sound[0]);
            }
        }
    })
    return sounds;
}

exports.stresses = function(sounds) {
    var stresses = [];
    sounds.map(function(sound){
        if (sound == ' ' || sound == '*') {
            stresses.push(sound);
        }
        else {
            stresses.push(pronouncing.stresses(sound));
        }
    })
    return stresses;
}

exports.sameStress = function(stresses) {
    var sameStress = [];
    var newLine = []

    stresses.map(function(stress) {
        sameStress.push(pronouncing.searchStresses(stress));
    }) 
    sameStress.map(function(newStress) {
        newLine.push(newStress[Math.floor(Math.random() * newStress.length)]);
    })

    return newLine;
}

