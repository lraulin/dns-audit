"use strict";
/**
 * Module for executing dig command and parsing dig output.
 */

const dig = require("node-dig-dns");
const stringify = require("json-stable-stringify");
const { insertIntoTblRecord, insertIntoTblRunDatetime } = require("./sqlite");
const { domains, domainIdLookup, types } = require("./dbCollections");
const { parseDigForRecordValues } = require("./digParse");
const logger = require("./logger");

const digDomain = async ({ runId, domain, types }) => {
  try {
    // Raw output of dig command.
    const raw = await dig([domain, "ANY"], { raw: true });

    insertIntoTblRecord({
      runId: runId,
      domainId: domainIdLookup[domain],
      records: stringify(parseDigForRecordValues({ digOutput: raw, types })),
      raw,
    });
  } catch (e) {
    logger.info(e);
  }
};

module.exports.digAllDomains = async server => {
  try {
    const runEpoch = new Date().getTime();
    const runId = insertIntoTblRunDatetime(runEpoch);
    for (let domain of domains) {
      logger.info(`Running dig for ${domain}...`);
      await digDomain({ runId, domain, server, types });
    }
  } catch (e) {
    logger.info(e);
  }
};
