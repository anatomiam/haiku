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
    // sameStress.map(function(newStress) {
    //     newLine.push(newStress[Math.floor(Math.random() * newStress.length)]);
    // })

    return sameStress;
}

exports.sameRhymes = function(words) {
    var wordRhymes = [];
    var newLine = [];

    words.map(function(word) {
        wordRhymes.push(pronouncing.rhymes(word));
    })
    // wordRhymes.map(function(newWord) {
    //     newLine.push(newWord[Math.floor(Math.random() * newWord.length)]);
    // })

    return wordRhymes;
}

function intersection_destructive(a, b)
{
  var result = [];
  while( a.length > 0 && b.length > 0 )
  {  
     if      (a[0] < b[0] ){ a.shift(); }
     else if (a[0] > b[0] ){ b.shift(); }
     else /* they're equal */
     {
       result.push(a.shift());
       b.shift();
     }
  }

  return result;
}

exports.sameStressAndRhyme = function(stressWords, rhymeWords) {
    var options = [];
    var newOptions = [];
    var newLines = [];
    var i = 0;
    stressWords.map(function(stresses) {
        options.push(intersection_destructive(stresses, rhymeWords[i]));
        i++;
    })

    options.map(function(option) {
        newLines.push(option[Math.floor(Math.random() * option.length)]);
    })
    // console.log(options);
    console.log(newLines);
    // console.log(newLines);
    return newLines;
}

exports.removeUndefined = function(original, generated) {
    newest = []
    var i = 0;
    generated.map(function(word) {
        if (word == undefined) {
            newest.push(original[i]);
        }
        else {
            newest.push(word);
        }
        i++;
    })
    return newest;

}

