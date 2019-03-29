"use strict";

const { getMismatches, insertIntoTblReport, cleanUp } = require("./sqlite");
const { digAllDomains } = require("./dig");
const { analyzeMismatches } = require("./analyzeMismatches");
const { createMessage } = require("./report");
const { sendEmailIfTime } = require("./messaging");
const logger = require("./logger");
const args = require("minimist")(process.argv.slice(2));

// IP for dig command
//const server = "152.120.225.240";

const main = async () => {
  if (args.d) {
    logger.log("info", "Starting digs");
    await digAllDomains();
    logger.info("Comparing last two runs...");
    const recordRows = getMismatches();
    const conflicts = analyzeMismatches(recordRows);
    const body = createMessage(conflicts, recordRows);
    insertIntoTblReport({ body, json: JSON.stringify(conflicts) });
  }
  if (args.m) {
    sendEmailIfTime(args.m);
  }
  if (args.h || args.help) {
    // Print help message
    const helpMessage = `DNS Auditing Tool
  -d       Run dig against all domains and compare to previous run.  
  -m       Send an email if more than a day elapsed since previous email.
  -m test  Send message to devs only and don't mark reports as read.
    `;
    logger.info(helpMessage);
  }
};

main();
