/**
 * Pure functions for parsing dig output.
 */

// Parse dig output and return object where key is record type
// and value is sorted list of values.
const parseDigForRecordValues = digOutput => {
  const answerSectionLines = digAnswerSection(digOutput).split("\n");
  const answers = {};
  answerRecords = answerSectionLines.forEach(line => {
    const parts = line.split(/\s+/);
    const type = parts[3];
    const value = parts.slice(4).join(" ");
    if (!answers[type]) answers[type] = [];
    answers[type].push(value);
  });
  Object.values(answers).forEach(arr => arr.sort());
  return answers;
};

// Take dig output, return line containing timestamp.
const digWhenLine = digOutput => digOutput.match(/;; WHEN: .*/)[0];

// Extract answer section from dig output
const digAnswerSection = digOutput => {
  const match = digOutput.match(/(?<=;; ANSWER SECTION:\s+).*?(?=\s+\n)/gs);
  return match ? match[0] : "";
};

// Given answer section of dig and answer value, return line containing value.
const digAnswerLine = ({ answerSection, value }) =>
  answerSection.split("\n").find(line => line.includes(value));

// Remove lines from answer section concerning irrelevant record types
const filterAnswers = ({ answerSection, typesToKeep }) =>
  answerSection
    .split("\n")
    .filter(line => typesToKeep.includes(line.split(/\s/)[3]))
    .join("\n");

module.exports = {
  digWhenLine,
  digAnswerLine,
  filterAnswers,
  parseDigForRecordValues,
  digAnswerSection,
};
