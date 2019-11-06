WITH
  patrons_with_date AS (
    SELECT mp.patron_id AS id,
      mp.institution_id,
      NVL2(mp.institution_id, regexp_replace(mp.institution_id, '([[:digit:]]{3})-([[:digit:]]{2})-([[:digit:]]{4})', '\1\2\3'), 'MSDB_' || mp.patron_id) AS external_system_id,
      mp.last_name,
      mp.first_name,
      mp.middle_name,
      NVL2(mp.expire_date, mp.expire_date, mp.purge_date) AS active_date,
      NVL2(mp.expire_date, mp.expire_date, mp.purge_date) AS expire_date,
      mp.purge_date,
      mp.sms_number,
      'MSDB' as schema
    FROM MSDB.patron mp
      LEFT JOIN AMDB.patron ap ON regexp_replace(mp.institution_id, '([[:digit:]]{3})-([[:digit:]]{2})-([[:digit:]]{4})', '\1\2\3') = regexp_replace(ap.institution_id, '([[:digit:]]{3})-([[:digit:]]{2})-([[:digit:]]{4})', '\1\2\3')
    WHERE mp.last_name IS NOT NULL
      AND ap.institution_id IS NULL
  )
SELECT id,
  institution_id,
  external_system_id,
  last_name,
  first_name,
  middle_name,
  to_char(active_date, 'YYYYMMDD') as active_data,
  to_char(expire_date, 'YYYY-MM-DD') as expire_date,
  purge_date,
  sms_number,
  schema
  FROM patrons_with_date
  ORDER BY external_system_id
;