WITH
  vendor_address_phone AS (
    SELECT va.vendor_id,
      LISTAGG(va.address_id || '::' || vp.phone_number || ';;') WITHIN GROUP (ORDER BY va.vendor_id, vp.address_id) OVER (PARTITION BY va.vendor_id) AS phone_number,
      LISTAGG(va.address_id || '::' || vp.phone_type || ';;') WITHIN GROUP (ORDER BY va.vendor_id, vp.address_id) OVER (PARTITION BY va.vendor_id) AS phone_type
    FROM MSDB.vendor_phone vp
      INNER JOIN MSDB.vendor_address va ON (vp.address_id = va.address_id)
    ORDER BY va.vendor_id, va.address_id
  ),
  vendor_address_part1 AS (
    SELECT vendor_id,
      LISTAGG(address_id || ';;') WITHIN GROUP (ORDER BY vendor_id, address_id) OVER (PARTITION BY vendor_id) AS address_ids,
      LISTAGG(address_id || '::' || std_address_number || ';;') WITHIN GROUP (ORDER BY vendor_id, address_id) OVER (PARTITION BY vendor_id) AS std_address_numbers,
      LISTAGG(address_id || '::' || order_address || ';;') WITHIN GROUP (ORDER BY vendor_id, address_id) OVER (PARTITION BY vendor_id) AS order_addresses,
      LISTAGG(address_id || '::' || payment_address || ';;') WITHIN GROUP (ORDER BY vendor_id, address_id) OVER (PARTITION BY vendor_id) AS payment_addreses,
      LISTAGG(address_id || '::' || return_address || ';;') WITHIN GROUP (ORDER BY vendor_id, address_id) OVER (PARTITION BY vendor_id) AS return_addresses,
      LISTAGG(address_id || '::' || claim_address || ';;') WITHIN GROUP (ORDER BY vendor_id, address_id) OVER (PARTITION BY vendor_id) AS claim_addresses,
      LISTAGG(address_id || '::' || email_address || ';;') WITHIN GROUP (ORDER BY vendor_id, address_id) OVER (PARTITION BY vendor_id) AS email_addresses,
      LISTAGG(address_id || '::' || other_address || ';;') WITHIN GROUP (ORDER BY vendor_id, address_id) OVER (PARTITION BY vendor_id) AS other_addresses,
      LISTAGG(address_id || '::' || contact_name || ';;') WITHIN GROUP (ORDER BY vendor_id, address_id) OVER (PARTITION BY vendor_id) AS contact_names,
      LISTAGG(address_id || '::' || contact_title || ';;') WITHIN GROUP (ORDER BY vendor_id, address_id) OVER (PARTITION BY vendor_id) AS contact_titles,
      LISTAGG(address_id || '::' || address_line1 || ';;') WITHIN GROUP (ORDER BY vendor_id, address_id) OVER (PARTITION BY vendor_id) AS address_line1s,
      LISTAGG(address_id || '::' || address_line2 || ';;') WITHIN GROUP (ORDER BY vendor_id, address_id) OVER (PARTITION BY vendor_id) AS address_line2s,
      LISTAGG(address_id || '::' || address_line3 || ';;') WITHIN GROUP (ORDER BY vendor_id, address_id) OVER (PARTITION BY vendor_id) AS address_line3s,
      LISTAGG(address_id || '::' || address_line4 || ';;') WITHIN GROUP (ORDER BY vendor_id, address_id) OVER (PARTITION BY vendor_id) AS address_line4s,
      LISTAGG(address_id || '::' || address_line5 || ';;') WITHIN GROUP (ORDER BY vendor_id, address_id) OVER (PARTITION BY vendor_id) AS address_line5s
    FROM MSDB.vendor_address
    ORDER BY vendor_id, address_id
  ),
  vendor_address_part2 AS (
    SELECT vendor_id,
      LISTAGG(address_id || '::' || city || ';;') WITHIN GROUP (ORDER BY vendor_id, address_id) OVER (PARTITION BY vendor_id) AS cities,
      LISTAGG(address_id || '::' || state_province || ';;') WITHIN GROUP (ORDER BY vendor_id, address_id) OVER (PARTITION BY vendor_id) AS state_provinces,
      LISTAGG(address_id || '::' || zip_postal || ';;') WITHIN GROUP (ORDER BY vendor_id, address_id) OVER (PARTITION BY vendor_id) AS zip_postals,
      LISTAGG(address_id || '::' || country || ';;') WITHIN GROUP (ORDER BY vendor_id, address_id) OVER (PARTITION BY vendor_id) AS countries,
      LISTAGG(address_id || '::' || modify_date || ';;') WITHIN GROUP (ORDER BY vendor_id, address_id) OVER (PARTITION BY vendor_id) AS modify_dates,
      LISTAGG(address_id || '::' || modify_operator_id || ';;') WITHIN GROUP (ORDER BY vendor_id, address_id) OVER (PARTITION BY vendor_id) AS modify_operator_ids
    FROM MSDB.vendor_address
    ORDER BY vendor_id, address_id
  ),
  vendor_address_parts_distinct AS (
    SELECT DISTINCT va1.vendor_id,
      va1.address_ids,
      va1.std_address_numbers,
      va1.order_addresses,
      va1.payment_addreses,
      va1.return_addresses,
      va1.claim_addresses,
      va1.email_addresses,
      va1.other_addresses,
      va1.contact_names,
      va1.contact_titles,
      va1.address_line1s,
      va1.address_line2s,
      va1.address_line3s,
      va1.address_line4s,
      va1.address_line5s,
      va2.cities,
      va2.state_provinces,
      va2.zip_postals,
      va2.countries,
      va2.modify_dates,
      va2.modify_operator_ids,
      vap.phone_number,
      vap.phone_type
    FROM vendor_address_part1 va1
      INNER JOIN vendor_address_part2 va2 ON va1.vendor_id = va2.vendor_id
      LEFT JOIN vendor_address_phone vap ON va1.vendor_id = vap.vendor_id
  ),
  vendor_alias_parts AS (
    SELECT vendor_id,
      LISTAGG(alt_vendor_name || ';;') WITHIN GROUP (ORDER BY vendor_id) OVER (PARTITION BY vendor_id) AS vendor_aliases
    FROM MSDB.alt_vendor_names
    ORDER BY vendor_id, alt_vendor_name
  ),
  vendor_alias_parts_distinct AS (
    SELECT DISTINCT vendor_id,
      vendor_aliases
    FROM vendor_alias_parts
  ),
  vendor_account_parts AS (
    SELECT va.account_id,
      va.vendor_id,
      va.account_number,
      va.account_name,
      va.default_po_type,
      va.deposit,
      va.default_discount,
      va.account_status,
      va.status_date,
      anp.note
    FROM MSDB.vendor_account va
      LEFT JOIN MSDB.account_note anp ON va.account_id = anp.account_id
  ),
  vendor_account2_parts AS (
    SELECT vendor_id,
      LISTAGG(account_id || ';;') WITHIN GROUP (ORDER BY vendor_id, account_id) OVER (PARTITION BY vendor_id) AS account_ids,
      LISTAGG(account_id || '::' || account_number || ';;') WITHIN GROUP (ORDER BY vendor_id, account_id) OVER (PARTITION BY vendor_id) AS account_numbers,
      LISTAGG(account_id || '::' || account_name || ';;') WITHIN GROUP (ORDER BY vendor_id, account_id) OVER (PARTITION BY vendor_id) AS account_names,
      LISTAGG(account_id || '::' || default_po_type || ';;') WITHIN GROUP (ORDER BY vendor_id, account_id) OVER (PARTITION BY vendor_id) AS default_po_types,
      LISTAGG(account_id || '::' || deposit || ';;') WITHIN GROUP (ORDER BY vendor_id, account_id) OVER (PARTITION BY vendor_id) AS deposits,
      LISTAGG(account_id || '::' || default_discount || ';;') WITHIN GROUP (ORDER BY vendor_id, account_id) OVER (PARTITION BY vendor_id) AS default_discounts,
      LISTAGG(account_id || '::' || account_status || ';;') WITHIN GROUP (ORDER BY vendor_id, account_id) OVER (PARTITION BY vendor_id) AS account_statuses,
      LISTAGG(account_id || '::' || status_date || ';;') WITHIN GROUP (ORDER BY vendor_id, account_id) OVER (PARTITION BY vendor_id) AS status_dates,
      LISTAGG(account_id || '::' || note || ';;') WITHIN GROUP (ORDER BY vendor_id, account_id) OVER (PARTITION BY vendor_id) AS account_notes
    FROM vendor_account_parts
  ),
  vendor_account2_parts_distinct AS (
    SELECT DISTINCT vendor_id,
      account_ids,
      account_numbers,
      account_names,
      default_po_types,
      deposits,
      default_discounts,
      account_statuses,
      status_dates,
      account_notes
    FROM vendor_account2_parts
  ),
  vendor_note_parts AS (
    SELECT vn.vendor_id,
      LISTAGG(vn.note || ';;') WITHIN GROUP (ORDER BY vn.vendor_id) OVER (PARTITION BY vn.vendor_id) AS vendor_notes
    FROM MSDB.vendor_note vn
  ),
  vendor_note_parts_distinct AS (
    SELECT DISTINCT vendor_id,
      vendor_notes
    FROM vendor_note_parts
  )
SELECT v.vendor_id,
  'VENDOR_MSDB' AS schema,
  v.vendor_code,
  v.vendor_name,
  v.federal_tax_id,
  v.institution_id,
  v.default_currency,
  v.claim_interval,
  v.claim_count,
  v.cancel_interval,
  v.ship_via,
  v.create_date,
  v.create_opid,
  v.update_date,
  v.update_opid,
  v.vendor_type,
  vadp.address_ids,
  vadp.std_address_numbers,
  vadp.order_addresses,
  vadp.payment_addreses,
  vadp.return_addresses,
  vadp.claim_addresses,
  vadp.email_addresses,
  vadp.other_addresses,
  vadp.contact_names,
  vadp.contact_titles,
  vadp.address_line1s,
  vadp.address_line2s,
  vadp.address_line3s,
  vadp.address_line4s,
  vadp.address_line5s,
  vadp.cities,
  vadp.state_provinces,
  vadp.zip_postals,
  vadp.countries,
  vadp.modify_dates,
  vadp.modify_operator_ids,
  vadp.phone_number,
  vadp.phone_type,
  valp.vendor_aliases,
  vacp.account_ids,
  vacp.account_numbers,
  vacp.account_names,
  vacp.default_po_types,
  vacp.deposits,
  vacp.default_discounts,
  vacp.account_statuses,
  vacp.status_dates,
  vacp.account_notes,
  vnop.vendor_notes
FROM MSDB.vendor v
  LEFT JOIN vendor_address_parts_distinct vadp ON v.vendor_id = vadp.vendor_id
  LEFT JOIN vendor_alias_parts_distinct valp ON v.vendor_id = valp.vendor_id
  LEFT JOIN vendor_account2_parts_distinct vacp ON v.vendor_id = vacp.vendor_id
  LEFT JOIN vendor_note_parts_distinct vnop ON v.vendor_id = vnop.vendor_id
ORDER BY v.vendor_id
;