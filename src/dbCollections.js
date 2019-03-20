/**
 * Module for generating unchanging lists and two-way id/name lookup objects
 * from data in the database file.
 */

const {
  selectAllFromTblDomain,
  selectAllFromTblType,
  selectLastTwoFromTblRunDatetime,
} = require("./sqlite");

// Get DNS record types of interest from database
const [types, typeIdLookup] = (() => {
  // Object for two-way mapping between types and ids
  const typeIdLookup = {};
  const types = [];
  const rows = selectAllFromTblType();
  rows.forEach(row => {
    typeIdLookup[row.type_id] = row.type_name;
    typeIdLookup[row.type_name] = row.type_id;
    types.push(row.type_name);
  });

  return [types, typeIdLookup];
})();

// Create list of domains and two-way id-domain lookup object.
const [domains, domainIdLookup] = (() => {
  const idLookup = {};
  const domainList = [];
  const rows = selectAllFromTblDomain();

  rows.forEach(row => {
    idLookup[row.domain_id] = row.domain_name;
    idLookup[row.domain_name] = row.domain_id;
    domainList.push(row.domain_name);
  });

  return [domainList, idLookup];
})();

const [runATime, runBTime] = (() => {
  const rows = selectLastTwoFromTblRunDatetime();
  return [new Date(rows[1].run_datetime), new Date(rows[0].run_datetime)];
})();

module.exports = {
  types,
  typeIdLookup,
  domains,
  domainIdLookup,
  runATime,
  runBTime,
};
