const readline = require('readline');
const fs = require('fs');

const LineType = {
  Id: 'Id',
  Time: 'Time',
  Text: 'Text',
}

const DelimiterType = {
  TimeDiff: '-->',
  Milli: ',',
  Stamp: ':',
  TextTerminator: '',
}

function readInputFile(fileName, callback) {
  const map = {};
  const rl = readline.createInterface({
    input: fs.createReadStream(fileName),
    output: process.stdout,
    terminal: false
  });
  let currentLineType = LineType.Id;
  let currentId = null;
  rl.on('line', (line) => {
    if (LineType.Id === currentLineType) {
      currentId = line.trim();
      map[currentId] = {};
      currentLineType = LineType.Time;
    } else if (LineType.Time === currentLineType) {
      const [startTime, endTime] = line.split(DelimiterType.TimeDiff).map(l => l.trim());
      map[currentId].startTimeMs = toMilli(startTime);
      map[currentId].endTimeMs = toMilli(endTime);
      currentLineType = LineType.Text;
    } else if (LineType.Text === currentLineType) {
      if (line.trim() === DelimiterType.TextTerminator) {
        currentLineType = LineType.Id;
      } else {
        const text = line;
        if (map[currentId].lines === undefined) {
          map[currentId].lines = [text];
        } else {
          map[currentId].lines.push(text);
        }
      }
    }
  });
  rl.on('close', () => {
    callback(map);
  });
}

function writeOutputFile(filePath, map) {
  const fileLines = [];
  Object.keys(map).map(Number).sort((a, b) => a - b).forEach(id => {
    fileLines.push(id);
    fileLines.push(
      `${toTimestamp(map[id].startTimeMs)} ${DelimiterType.TimeDiff} ${toTimestamp(map[id].endTimeMs)}`
    );
    fileLines.push(...map[id].lines);
    fileLines.push(DelimiterType.TextTerminator);
  });
  fs.writeFile(filePath, fileLines.join('\n'), error => {
    if (error) {
      console.log(error);
    } else {
      console.log('File Saved.');
    }
  });
}

function toMilli(time) {
  //'00:02:35,728'
  const [hrmmss, ms] = time.split(DelimiterType.Milli);
  const [hr, mm, ss] = hrmmss.split(DelimiterType.Stamp);
  return Number(ms) + Number(ss) * 1_000 + Number(mm) * 60 * 1_000 + Number(hr) * 60 * 60 * 1_000;
}

function toTimestamp(millis) {
  //142415
  const hr = Math.floor(millis / (60 * 60 * 1_000));
  const mm = Math.floor((millis - (hr * 60 * 60 * 1_000)) / (60 * 1_000));
  const ss = Math.floor((millis - (hr * 60 * 60 * 1_000) - (mm * 60 * 1_000)) / 1_000);
  const ms = millis - (hr * 60 * 60 * 1_000) - (mm * 60 * 1_000) - (ss * 1_000);
  return `${prependZeros(hr, 2)}${DelimiterType.Stamp}${prependZeros(mm, 2)}${DelimiterType.Stamp}${prependZeros(ss, 2)}${DelimiterType.Milli}${prependZeros(ms, 3)}`;
}

function prependZeros(num, p) {
  let numStr = String(num);
  if (numStr.length > p) {
    throw 'bad format';
  }
  while (numStr.length < p) {
    numStr = `0${numStr}`;
  }
  return numStr;
}

module.exports = {
  readInputFile,
  writeOutputFile
}
