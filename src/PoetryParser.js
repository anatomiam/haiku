// var pr = require('pronouncing')

export function cleanLine(line) {
        var lower_line = line.toLowerCase();
        var split_line = lower_line.split(" ");
        var words = [];
        for (var i=0;i<split_line.length;i++) {
            words.push(split_line[i].replace(/[^A-Za-z0-9]+/g, ''))
        }
        return words;
    }


