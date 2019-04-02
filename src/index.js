"use strict";

const minimist = require("minimist");
const { getMismatches, insertIntoTblReport, cleanUp } = require("./sqlite");
const { digAllDomains } = require("./dig");
const { analyzeMismatches } = require("./analyzeMismatches");
const { createMessage } = require("./report");
const { sendEmailIfTime } = require("./messaging");
const logger = require("./logger");
const { version } = require("../package");

const help = () => {
  console.log(`DNS Auditing Script v${version}
  options:
  -d --dig      Run dig for all domains and compare to last run, storing results.
  -m --message  Combine reports since last email was sent to distribution list
                  and send to distribution list.
  -t --test     Combine reports since last email was sent to distrubution list 
                  but send only to devs.
  -c --clean    Delete data older than given number of hours. Default 24.
`);
};

const args = minimist(process.argv.slice(2), {
  number: ["clean"],
  alias: {
    c: "clean",
    d: "dig",
    h: "help",
    m: "message",
    t: "test",
    v: "version",
  },
  unknown: () => {
    console.log("Unknown argument. Use -h or --help for help.");
    process.exit();
  },
});

// Show version if called with version flag
if (args.v) {
  console.log(version);
}

// Show usage instructions and quit if called with help flag
if (args.h) {
  help();
}

(async () => {
  if (args.d) {
    logger.log("info", "Starting digs");
    await digAllDomains();
    logger.info("Comparing last two runs...");
    const recordRows = getMismatches();
    const conflicts = analyzeMismatches(recordRows);
    const body = createMessage(conflicts, recordRows);
    insertIntoTblReport({ body, json: JSON.stringify(conflicts) });
  }
  if (args.m || args.t) {
    sendEmailIfTime(args.t);
  }
  if (args.c) {
    const hours = args.c === true ? 24 : args.c;
    cleanUp(hours);
  }
})();
