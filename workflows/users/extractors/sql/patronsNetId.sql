SELECT uin,
  tamu_netid
FROM PATRON.person_identifiers
WHERE tamu_netid IS NOT NULL
ORDER BY uin
;