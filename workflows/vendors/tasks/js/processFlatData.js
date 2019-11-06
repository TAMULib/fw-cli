if (typeof args.sourceData.address_ids === 'string') {
  args.sourceData.address_ids = [args.sourceData.address_ids];
}

if (typeof args.sourceData.account_ids === 'string') {
  args.sourceData.account_ids = [args.sourceData.account_ids];
}

args.vendorRequestBody.id = args.sourceData.folioReference;
args.vendorRequestBody.name = args.sourceData.VENDOR_NAME;
args.vendorRequestBody.code = args.sourceData.VENDOR_CODE;
args.vendorRequestBody.description = args.vendorTypes[args.sourceData.VENDOR_TYPE] ?
  args.vendorTypes[args.sourceData.VENDOR_TYPE] :
  args.sourceData.VENDOR_TYPE ?
    args.sourceData.VENDOR_TYPE :
    '';
args.vendorRequestBody.status = args.statuses[0];
args.vendorRequestBody.taxId = args.sourceData.FEDERAL_TAX_ID;
args.vendorRequestBody.isVendor = true;
args.vendorRequestBody.vendorCurrencies.push(args.sourceData.DEFAULT_CURRENCY);
args.vendorRequestBody.claimingInterval = args.sourceData.CLAIM_INTERVAL;
var aliases_length = args.sourceData.vendor_aliases ? args.sourceData.vendor_aliases.length : 0;
for (var i = 0; i < aliases_length; i++) {
  if (args.sourceData.vendor_aliases[i]) {
    args.vendorRequestBody.aliases.push({
      'value': args.sourceData.vendor_aliases[i],
      'description': ''
    });
  }
}
returnObj = args;