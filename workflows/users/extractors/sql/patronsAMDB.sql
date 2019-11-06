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
      'USER_AMDB_UIN' as schema
    FROM AMDB.patron ap
    WHERE ap.last_name IS NOT NULL
  ),
  patron_barcodes_ranked AS (
    SELECT pb.patron_id AS id,
      pb.barcode_status,
      pb.barcode_status_date,
      DECODE (patron_group_code,
        'fast', 1,
        'grad', 2,
        'ungr', 3,
        'illend', 4,
        'libd', 5,
        'comm', 6,
        'cour', 7,
        'texs', 8,
        'nonr', 9
      ) AS patron_group_level,
      pg.patron_group_code,
      pb.patron_barcode,
      RANK() OVER (PARTITION BY pb.patron_id, pg.patron_group_id ORDER BY barcode_status, barcode_status_date DESC) barcode_rank
    FROM AMDB.patron_barcode pb
      INNER JOIN AMDB.patron_group pg ON pb.patron_group_id = pg.patron_group_id
    ORDER BY pb.barcode_status ASC, pb.barcode_status_date DESC, patron_group_level
  ),
  patron_barcodes AS (
    SELECT id,
      barcode_status,
      to_char(barcode_status_date, 'YYYYMMDD') as barcode_status_date,
      patron_group_code,
      patron_group_level,
      patron_barcode
    FROM patron_barcodes_ranked
    WHERE barcode_rank = 1
    ORDER BY id
  ),
  patron_phone_with_desc AS (
    SELECT pp.*,
      pt.phone_desc
    FROM AMDB.patron_phone pp
      LEFT JOIN phone_type pt ON pp.phone_type = pt.phone_type
  ),
  patron_addresses_full AS (
    SELECT pa.patron_id AS id,
      pa.address_id,
      pa.address_type,
      at.address_desc,
      pa.address_line1,
      NVL2(
        pa.address_line2,
        NULL,
        NVL2(
          address_line3,
          TRIM(pa.address_line2),
          NVL2(
            address_line4,
            TRIM(pa.address_line2 || ' ' || pa.address_line3),
            NVL2(
              address_line5,
              TRIM(pa.address_line2 || ' ' || pa.address_line3 || ' ' || pa.address_line4),
              TRIM(pa.address_line2 || ' ' || pa.address_line3 || ' ' || pa.address_line4 || ' ' || pa.address_line5)
            )
          )
        )
      ) AS address_line2,
      pa.city,
      pa.state_province,
      pa.zip_postal,
      pa.country,
      pa.address_status,
      pa.effect_date,
      pp.phone_number,
      pp.phone_desc
    FROM AMDB.patron_address pa
      LEFT JOIN AMDB.address_type at ON pa.address_type = at.address_type
      LEFT JOIN patron_phone_with_desc pp ON pa.address_id = pp.address_id
    WHERE pa.effect_date < sysdate
    ORDER BY pa.patron_id
  ),
  patron_addresses_ranked AS (
    SELECT id,
      address_id,
      address_type,
      address_desc,
      address_line1,
      address_line2,
      city,
      state_province,
      zip_postal,
      country,
      address_status,
      effect_date,
      phone_number,
      phone_desc,
      RANK() OVER (PARTITION BY id, address_type ORDER BY effect_date DESC) dest_rank
    FROM patron_addresses_full
    WHERE address_type IN (2, 3)
    ORDER BY id, address_id
  ),
  patron_addresses_ranked_email AS (
    SELECT id,
      address_id,
      address_line1 AS email
    FROM patron_addresses_ranked
    WHERE address_type = 3
      AND dest_rank = 1
    ORDER BY id, address_id
  ),
  patron_addresses_union AS (
    SELECT id,
      address_id,
      address_type,
      address_desc,
      address_line1,
      address_line2,
      city,
      state_province,
      zip_postal,
      country,
      address_status,
      effect_date,
      phone_number,
      phone_desc
    FROM patron_addresses_ranked
    WHERE dest_rank = 1
      AND address_type = 2
    UNION
    SELECT id,
      address_id,
      address_type,
      address_desc,
      address_line1,
      address_line2,
      city,
      state_province,
      zip_postal,
      country,
      address_status,
      effect_date,
      phone_number,
      phone_desc
    FROM patron_addresses_full
    WHERE address_type = 1
  ),
  patron_addresses_aggregate AS (
    SELECT DISTINCT(id),
      LISTAGG(pau.address_id || ';;') WITHIN GROUP (ORDER BY pau.id, pau.address_id) OVER (PARTITION BY pau.id) AS address_id,
      LISTAGG(pau.address_id || '::' || pau.address_type || ';;') WITHIN GROUP (ORDER BY pau.id, pau.address_id, pau.address_type) OVER (PARTITION BY pau.id) AS address_type,
      LISTAGG(pau.address_id || '::' || pau.address_desc || ';;') WITHIN GROUP (ORDER BY pau.id, pau.address_id, pau.address_desc) OVER (PARTITION BY pau.id) AS address_desc,
      LISTAGG(pau.address_id || '::' || pau.address_line1 || ';;') WITHIN GROUP (ORDER BY pau.id, pau.address_id, pau.address_line1) OVER (PARTITION BY pau.id) AS address_line1,
      LISTAGG(pau.address_id || '::' || pau.address_line2 || ';;') WITHIN GROUP (ORDER BY pau.id, pau.address_id, pau.address_line2) OVER (PARTITION BY pau.id) AS address_line2,
      LISTAGG(pau.address_id || '::' || pau.city || ';;') WITHIN GROUP (ORDER BY pau.id, pau.address_id, pau.city) OVER (PARTITION BY pau.id) AS city,
      LISTAGG(pau.address_id || '::' || pau.state_province || ';;') WITHIN GROUP (ORDER BY pau.id, pau.address_id, pau.state_province) OVER (PARTITION BY pau.id) AS state_province,
      LISTAGG(pau.address_id || '::' || pau.zip_postal || ';;') WITHIN GROUP (ORDER BY pau.id, pau.address_id, pau.zip_postal) OVER (PARTITION BY pau.id) AS zip_postal,
      LISTAGG(pau.address_id || '::' || pau.country || ';;') WITHIN GROUP (ORDER BY pau.id, pau.address_id, pau.country) OVER (PARTITION BY pau.id) AS country,
      LISTAGG(pau.address_id || '::' || pau.address_status || ';;') WITHIN GROUP (ORDER BY pau.id, pau.address_id, pau.address_status) OVER (PARTITION BY pau.id) AS address_status,
      LISTAGG(pau.address_id || '::' || pau.effect_date || ';;') WITHIN GROUP (ORDER BY pau.id, pau.address_id, pau.effect_date) OVER (PARTITION BY pau.id) AS effect_date,
      LISTAGG(pau.address_id || '::' || pau.phone_number || ';;') WITHIN GROUP (ORDER BY pau.id, pau.address_id, pau.phone_number) OVER (PARTITION BY pau.id) AS phone_number,
      LISTAGG(pau.address_id || '::' || pau.phone_desc || ';;') WITHIN GROUP (ORDER BY pau.id, pau.address_id, pau.phone_desc) OVER (PARTITION BY pau.id) AS phone_desc
    FROM patron_addresses_union pau
    ORDER BY id
  )
SELECT pwd.id,
  pwd.institution_id,
  pwd.external_system_id,
  pwd.last_name,
  pwd.first_name,
  pwd.middle_name,
  to_char(pwd.active_date, 'YYYYMMDD') as active_data,
  to_char(pwd.expire_date, 'YYYY-MM-DD') as expire_date,
  pwd.purge_date,
  pwd.sms_number,
  pwd.schema,
  pb.barcode_status,
  pb.barcode_status_date,
  pb.patron_group_code,
  pb.patron_group_level,
  pb.patron_barcode,
  paa.address_id,
  paa.address_type,
  paa.address_desc,
  paa.address_line1,
  paa.address_line2,
  paa.city,
  paa.state_province,
  paa.zip_postal,
  paa.country,
  paa.address_status,
  paa.effect_date,
  paa.phone_number,
  paa.phone_desc,
  pare.email
FROM patrons_with_date pwd
  LEFT JOIN patron_barcodes pb ON pwd.id = pb.id
  LEFT JOIN patron_addresses_aggregate paa ON pwd.id = paa.id
  LEFT JOIN patron_addresses_ranked_email pare ON paa.id = pare.id
ORDER BY pwd.external_system_id
;