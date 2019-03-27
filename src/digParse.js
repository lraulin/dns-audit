"use strict";
/**
 * Pure functions for parsing dig output.
 */

// Extract answer section from dig output
const digAnswerSection = digOutput => {
  const match = digOutput.match(/(?<=;; ANSWER SECTION:\s+).*?(?=\s+\n)/gs);
  return match ? match[0] : "";
};

module.exports.digAnswerSection = digAnswerSection;

// Parse dig output and return object where key is record type
// and value is sorted list of values.
module.exports.parseDigForRecordValues = ({ digOutput = "", types = [] }) => {
  const answerSectionLines = digAnswerSection(digOutput).split("\n");
  const answers = {};
  answerRecords = answerSectionLines.forEach(line => {
    const parts = line.split(/\s+/);
    const type = parts[3];
    if (types.includes(type)) {
      if (!answers[type]) answers[type] = [];
      answers[type].push(parts.slice(4).join(" "));
    }
  });
  Object.values(answers).forEach(arr => arr.sort());
  return answers;
};

// Take dig output, return line containing timestamp.
module.exports.digWhenLine = digOutput => {
  const match = digOutput.match(/;; WHEN: .*/);
  return match && match[0];
};

// Given answer section of dig and answer value, return line containing value.
module.exports.digAnswerLine = ({ answerSection, value }) =>
  answerSection.split("\n").find(line => line.includes(value));

// Remove lines from answer section concerning irrelevant record types
module.exports.filterAnswers = ({ answerSection, typesToKeep }) =>
  answerSection
    .split("\n")
    .filter(line => typesToKeep.includes(line.split(/\s/)[3]))
    .join("\n");
