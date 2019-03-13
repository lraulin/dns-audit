DROP TABLE IF EXISTS temp.a;
CREATE TEMP TABLE a AS
SELECT record_timestamp, domain_id, record_values, raw
FROM tbl_record
WHERE 
  run_id = (
    SELECT
  MAX(run_id)
FROM
  tbl_record
WHERE 
      run_id NOT IN (
        SELECT
  MAX(run_id)
FROM
  tbl_record
      )
  );

DROP TABLE IF EXISTS temp.b;
CREATE TEMP TABLE b AS
SELECT record_timestamp, domain_id, record_values, raw
FROM tbl_record
WHERE 
  run_id = (
    SELECT
  MAX(run_id)
FROM
  tbl_record
  );

SELECT a.domain_id, a.record_values AS values_A, a.raw as raw_A, b.record_values AS values_B, b.record_values AS timestamp_B, b.raw AS raw_B
FROM a
  INNER JOIN b on a.domain_id = b.domain_id
WHERE values_A <> values_B;