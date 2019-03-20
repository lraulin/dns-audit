/**
 * Module for executing dig command and parsing dig output.
 */

const dig = require("node-dig-dns");
const stringify = require("json-stable-stringify");
const { insertIntoTblRecord, insertIntoTblRunDatetime } = require("./sqlite");
const { domains, domainIdLookup } = require("./dbCollections");
const { parseDigForRecordValues } = require("./digParse");

const digDomain = async ({ runId, domain, server }) => {
  try {
    // Raw output of dig command.
    const raw = await dig([server, domain, "ANY"], { raw: true });

    insertIntoTblRecord({
      runId: runId,
      domainId: domainIdLookup[domain],
      records: stringify(parseDigForRecordValues(raw)),
      raw,
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports.digAllDomains = async server => {
  try {
    const runEpoch = new Date().getTime();
    const runId = insertIntoTblRunDatetime(runEpoch);
    for (let domain of domains) {
      console.log(`Running dig for ${domain}...`);
      await digDomain({ runId, domain, server });
    }
  } catch (e) {
    console.log(e);
  }
};
