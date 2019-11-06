if (typeof args.sourceData.address_ids === 'string') {
  args.sourceData.address_ids = [args.sourceData.address_ids];
}

if (typeof args.sourceData.account_ids === 'string') {
  args.sourceData.account_ids = [args.sourceData.account_ids];
}

args.vendorResponseBody.id = args.sourceData.folioReference;
args.vendorResponseBody.name = args.sourceData.VENDOR_NAME;
args.vendorResponseBody.code = args.sourceData.VENDOR_CODE;
args.vendorResponseBody.description = args.vendorTypes[args.sourceData.VENDOR_TYPE] ?
  args.vendorTypes[args.sourceData.VENDOR_TYPE] :
  args.sourceData.VENDOR_TYPE ?
    args.sourceData.VENDOR_TYPE :
    '';
args.vendorResponseBody.status = args.statuses[0];
args.vendorResponseBody.taxId = args.sourceData.FEDERAL_TAX_ID;
args.vendorResponseBody.isVendor = true;
args.vendorResponseBody.vendorCurrencies.push(args.sourceData.DEFAULT_CURRENCY);
args.vendorResponseBody.claimingInterval = args.sourceData.CLAIM_INTERVAL;
var aliases_length = args.sourceData.vendor_aliases ? args.sourceData.vendor_aliases.length : 0;
for (var i = 0; i < aliases_length; i++) {
  if (args.sourceData.vendor_aliases[i]) {
    args.vendorResponseBody.aliases.push({
      'value': args.sourceData.vendor_aliases[i],
      'description': ''
    });
  }
}
returnObj = args;