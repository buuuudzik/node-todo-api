var fs = require('fs');

var startMeasureTime = () => {
  var start = new Date().getTime();
  return start;
};

// sync version
console.log('Start');
var start = startMeasureTime();

for (var i = 1; i<=3; i++) {
  var fileName = `Lorem-${i}.txt`;
  var fileContents = fs.readFileSync(fileName);
  console.log(`File ${i} was downloaded(${fileContents.length/1000}KB) after ${new Date().getTime() - start}ms from start.`);
};

// async version
setImmediate(() => {
  console.log('Start');
  var start = startMeasureTime();
  
  for (var i = 1; i<=3; i++) {
    var fileName = `Lorem-${i}.txt`;
    fs.readFile(fileName, {encoding: 'utf8'}, (err, fileContents) => {
      console.log(`File ${fileName} was downloaded(${fileContents.length/1000}KB) after ${new Date().getTime() - start}ms from start.`);
    });
  };
});