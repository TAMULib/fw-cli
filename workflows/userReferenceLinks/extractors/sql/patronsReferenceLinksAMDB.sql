WITH
  patrons_with_date AS (
    SELECT ap.patron_id AS id,
      ap.institution_id,
      NVL2(ap.institution_id, regexp_replace(ap.institution_id, '([[:digit:]]{3})-([[:digit:]]{2})-([[:digit:]]{4})', '\1\2\3'), 'AMDB_' || ap.patron_id) AS external_system_id,
      ap.last_name,
      ap.first_name,
      ap.middle_name,
      NVL2(ap.expire_date, ap.expire_date, ap.purge_date) AS active_date,
      NVL2(ap.expire_date, ap.expire_date, ap.purge_date) AS expire_date,
      ap.purge_date,
      ap.sms_number,
      'AMDB' as schema
    FROM AMDB.patron ap
    WHERE ap.last_name IS NOT NULL
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