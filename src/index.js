"use strict";

const { getMismatches, cleanUp } = require("./sqlite");
const { digAllDomains } = require("./dig");
const { analyzeMismatches } = require("./analyzeMismatches");
const { createMessage } = require("./report");

// IP for dig command
const server = "152.120.225.240";

const main = async () => {
  await digAllDomains(server);
  const recordRows = getMismatches();
  const conflicts = analyzeMismatches(recordRows);
  const message = createMessage(conflicts, recordRows);
  console.log(message);
  //cleanUp();
};

main();
