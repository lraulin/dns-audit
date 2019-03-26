"use strict";

const { getMismatches, insertIntoTblReport, cleanUp } = require("./sqlite");
const { digAllDomains } = require("./dig");
const { analyzeMismatches } = require("./analyzeMismatches");
const { createMessage } = require("./report");
const { sendEmailIfTime } = require("./messaging");

// IP for dig command
const server = "152.120.225.240";

const main = async () => {
  await digAllDomains(server);
  const recordRows = getMismatches();
  const conflicts = analyzeMismatches(recordRows);
  const body = createMessage(conflicts, recordRows);
  insertIntoTblReport({ body, json: JSON.stringify(conflicts) });
  sendEmailIfTime();
};

main();
