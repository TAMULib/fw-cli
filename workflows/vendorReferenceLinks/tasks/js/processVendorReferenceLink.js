var vendorTypes = {
  AMDB: '{{modExternalReferenceResolver}}/referenceLinkTypes/08c7dd18-dbaf-11e9-8a34-2a2ae2dbcce4',
  MSDB: '{{modExternalReferenceResolver}}/referenceLinkTypes/08c7df8e-dbaf-11e9-8a34-2a2ae2dbcce4'
};

var returnObj = {
  folioReference: UUID.randomUUID().toString(),
  externalReference: args.VENDOR_ID,
  type: args.SCHEMA.toLowerCase() === 'amdb' ? vendorTypes.AMDB : vendorTypes.MSDB
};