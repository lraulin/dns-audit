DROP 
  TABLE IF EXISTS temp.a;
DROP 
  TABLE IF EXISTS temp.b;
CREATE TEMP TABLE temp.b AS
SELECT
  queried_at,
  datetime,
  domain,
  type,
  answers
FROM
  records
WHERE 
  queried_at = (
    SELECT
  MAX(queried_at)
FROM
  records
  );
CREATE TEMP TABLE temp.a AS
SELECT
  queried_at,
  datetime,
  domain,
  type,
  answers
FROM
  records
WHERE 
  queried_at = (
    SELECT
  MAX(queried_at)
FROM
  records
WHERE 
      queried_at NOT IN (
        SELECT
  MAX(queried_at)
FROM
  records
      )
  );
SELECT
  a.queried_at,
  b.queried_at,
  a.domain,
  a.type,
  a.datetime,
  a.answers,
  b.datetime,
  b.answers
FROM
  a
  INNER JOIN b ON a.domain = b.domain
    AND a.type = b.type
WHERE 
  a.answers <> b.answers;
