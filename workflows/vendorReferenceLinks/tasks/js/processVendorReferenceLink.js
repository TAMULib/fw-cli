var vendorTypes = {
  VENDOR_AMDB: '{{mod-external-reference-resolver}}/referenceLinkTypes/08c7dd18-dbaf-11e9-8a34-2a2ae2dbcce4',
  VENDOR_MSDB: '{{mod-external-reference-resolver}}/referenceLinkTypes/08c7df8e-dbaf-11e9-8a34-2a2ae2dbcce4'
};

var returnObj = {
  folioReference: UUID.randomUUID().toString(),
  externalReference: args.VENDOR_ID,
  type: vendorTypes[args.SCHEMA]
};