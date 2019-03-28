"use strict";

import { getMismatches, insertIntoTblReport, cleanUp } from "./sqlite";
import { digAllDomains } from "./dig";
import { analyzeMismatches } from "./analyzeMismatches";
import { createMessage } from "./report";
import { sendEmailIfTime } from "./messaging";

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
