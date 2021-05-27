#!/usr/bin/env node

const fs = require('fs');
const {readInputFile, writeOutputFile} = require('./index.js');

function getHelp() {
  return `
usage: srt-shift [-i <path>] [-o <path>]

-i, --input\tinput file
-o, --output\toutput file
-s, --shift\tshift all subtitles in milliseconds, e.g. +1233 would add 1233 milliseconds
\t\tto all subtitles, and -645 would subtract 645 milliseconds from each subtitle
	`;
}

function validateInput(input) {
  if (!input.inputFile || !input.outputFile) {
    throw 'Incorrect arguments';
  }
  if (!fs.existsSync(input.inputFile)) {
    throw 'Input file does not exist';
  }
  if (fs.existsSync(input.outputFile)) {
    throw 'Output file already exists';
  }
  let shiftMs = 0;
  if (input.shiftBy) {
    const s = input.shiftBy.trim();
    if (s.startsWith('+') || s.startsWith('-')) {
      shiftMs = Number(input.shiftBy)
      if (isNaN(shiftMs)) {
        throw 'Incorrect shift';
      }
    } else {
      throw 'Incorrect shift';
    }
  }
  return {
    inputFile: input.inputFile,
    outputFile: input.outputFile,
    shiftMs,
  }
}

function getInput(argv) {
  let args = argv.slice(2)
  args = args.map(a => a.trim());
  let i = 0;
  let inputFile, outputFile, shiftBy;
  while (i < args.length) {
    const arg = args[i];
    switch (arg.trim()) {
      case '-i':
      case '--input':
        if (inputFile) {
          throw 'Incorrect arguments'
        }
        inputFile = args[i + 1];
        break;
      case '-o':
      case '--output':
        if (outputFile) {
          throw 'Incorrect arguments'
        }
        outputFile = args[i + 1];
        break;
      case '-s':
      case '--shift':
        if (shiftBy) {
          throw 'Incorrect arguments'
        }
        shiftBy = args[i + 1];
        break;
      default:

    }
    i++;
  }

  return {
    inputFile,
    outputFile,
    shiftBy,
    shiftMs: 0,
  }
}

try {
  const input = getInput(process.argv);
  const validatedInput = validateInput(input);
  readInputFile(validatedInput.inputFile, map => {
    const shiftedMap = {};
    for (const [key, value] of Object.entries(map)) {
      shiftedMap[key] = {
        ...value,
        startTimeMs: value.startTimeMs + validatedInput.shiftMs,
        endTimeMs: value.endTimeMs + validatedInput.shiftMs,
      }
    }
    writeOutputFile(validatedInput.outputFile, shiftedMap);
  });
} catch (e) {
  console.log(e);
  console.log(getHelp());
}
