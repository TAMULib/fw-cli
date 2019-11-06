if (typeof args.sourceData.ADDRESS_IDS === 'string') {
  args.sourceData.ADDRESS_IDS = [args.sourceData.ADDRESS_IDS];
}

if (typeof args.sourceData.ACCOUNT_IDS === 'string') {
  args.sourceData.ACCOUNT_IDS = [args.sourceData.ACCOUNT_IDS];
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
var aliases_length = args.sourceData.VENDOR_ALIASES ? args.sourceData.VENDOR_ALIASES.length : 0;
for (var i = 0; i < aliases_length; i++) {
  if (args.sourceData.VENDOR_ALIASES[i]) {
    args.vendorRequestBody.aliases.push({
      'value': args.sourceData.VENDOR_ALIASES[i],
      'description': ''
    });
  }
}
returnObj = args;