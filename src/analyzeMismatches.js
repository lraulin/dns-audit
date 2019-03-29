"use strict";
/**
 * Function that analyzes rows from mismatch query. Returns array of objects
 * with keys: domain, type, whenLineA, whenLineB, changeType, valuesA, valuesB,
 * digLineA, digLineB
 */
const { domainIdLookup } = require("./dbCollections");
const { digAnswerSection, digAnswerLine, digWhenLine } = require("./digParse");
const logger = require("./logger");

module.exports.analyzeMismatches = rows => {
  const changes = [];
  rows.forEach(row => {
    const domain = domainIdLookup[row.domain_id];
    const values_A = JSON.parse(row.values_A);
    const values_B = JSON.parse(row.values_B);
    const answerSectionA = digAnswerSection(row.raw_A);
    const answerSectionB = digAnswerSection(row.raw_B);
    // Unique list of all record types present in either run.
    const allTypes = Array.from(
      new Set(Object.keys(values_A).concat(Object.keys(values_B).sort())),
    );
    // Get timestamps for both records
    const whenLineA = digWhenLine(row.raw_A);
    const whenLineB = digWhenLine(row.raw_B);
    allTypes.forEach(type => {
      // Skip if there are no records for this type
      if (!values_A[type] && !values_B[type]) return;
      // If there are no records for a type, set the value to an empty array
      if (!values_A[type]) values_A[type] = [];
      if (!values_B[type]) values_B[type] = [];
      // Remove matching record values
      const uniqueA = values_A[type].filter(
        value => !values_B[type].includes(value),
      );
      const uniqueB = values_B[type].filter(
        value => !values_A[type].includes(value),
      );
      const len = Math.max(uniqueA.length, uniqueB.length);
      for (let i = 0; i < len; i++) {
        const change = {
          domain,
          type,
          whenLineA,
          whenLineB,
        };
        change.changeType =
          uniqueA[i] && uniqueB[i]
            ? "change"
            : uniqueB[i]
            ? "addition"
            : "deletion";
        change.valuesA = uniqueA[i] || null;
        change.valuesB = uniqueB[i] || null;
        change.digLineA = change.valuesA
          ? digAnswerLine({
              answerSection: answerSectionA,
              value: change.valuesA,
            })
          : null;
        change.digLineB = change.valuesB
          ? digAnswerLine({
              answerSection: answerSectionB,
              value: change.valuesB,
            })
          : null;
        changes.push(change);
      }
    });
  });
  return changes;
};
