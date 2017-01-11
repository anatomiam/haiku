const spawn = require('child_process').spawn;
const process = spawn("python", ["python/poetryparser.py"]);
const util = require('util');

// Handle normal output
process.stdout.on('data', (data) => {
    console.log(String.fromCharCode.apply(null, data));
});

// Write data (remember to send only strings or numbers, otherwhise python wont understand)
var data = JSON.stringify("Hello World There Are None");
process.stdin.write(data);
// End data write
process.stdin.end();

