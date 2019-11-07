var isActive = function (expireDateString) {
  var todayDate = new Date();
  var year = expireDateString.substring(0, 4);
  var month = expireDateString.substring(4, 6);
  var day = expireDateString.substring(6, 8);
  var expireDate = new Date(year, month, day);
  if (expireDate - todayDate > 0) {
    return 'true';
  } else {
    return 'false';
  }
};

args.userRequestBody.id = args.sourceData.id;
args.userRequestBody.username = args.sourceData.netid ? args.sourceData.netid : args.sourceData.SCHEMA + '_' + args.sourceData.ID;
args.userRequestBody.externalSystemId = args.sourceData.EXTERNAL_SYSTEM_ID;
args.userRequestBody.barcode = args.sourceData.PATRON_BARCODE;

if (args.sourceData.ACTIVE_DATE) {
  args.userRequestBody.expirationDate = args.sourceData.EXPIRE_DATE;
  args.userRequestBody.active = isActive(args.sourceData.ACTIVE_DATE);
} else {
  args.userRequestBody.active = 'true';
}

args.userRequestBody.type = 'patron';
args.userRequestBody.personal.lastName = args.sourceData.LAST_NAME;
if (args.sourceData.FIRST_NAME) {
  args.userRequestBody.personal.firstName = args.sourceData.FIRST_NAME;
}

if (args.sourceData.MIDDLE_NAME) {
  args.userRequestBody.personal.middleName = args.sourceData.MIDDLE_NAME;
}

returnObj = args;