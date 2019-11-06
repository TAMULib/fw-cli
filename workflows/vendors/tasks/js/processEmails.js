if (args.sourceData.ADDRESS_IDS) {
  for (var i = 0; i < args.sourceData.ADDRESS_IDS.length; i++) {
    var emailObj = {};
    var addressId = args.sourceData.ADDRESS_IDS[i];
    emailObj.value = args.sourceData.ADDRESS_LINE1S[addressId];
    if (isEmailLike(emailObj.value)) {
      emailObj.description = null;
      emailObj.categories = [];

      if (args.sourceData.ORDER_ADDRESSES[addressId] === 'Y')
        emailObj.categories.push(args.categories.ORDER);

      if (args.sourceData.PAYMENT_ADDRESES[addressId] === 'Y')
        emailObj.categories.push(args.categories.PAYMENT);

      if (args.sourceData.CLAIM_ADDRESSES[addressId] === 'Y')
        emailObj.categories.push(args.categories.CLAIM);

      if (args.sourceData.RETURN_ADDRESSES[addressId] === 'Y')
        emailObj.categories.push(args.categories.RETURN);

      if (args.sourceData.OTHER_ADDRESSES[addressId] === 'Y')
        emailObj.categories.push(args.categories.OTHER);

      if (args.sourceData.CONTACT_NAMES[addressId] && args.vendorRequestBody.contacts.length > 0) {
        for (var j = 0; j < args.vendorRequestBody.contacts.length; j++) {
          var c = args.vendorRequestBody.contacts[j];
          if (c.firstName === args.sourceData.CONTACT_NAMES[addressId]) {
            c.emails.push(emailObj);
          }
        }
      } else {
        args.vendorRequestBody.emails.push(emailObj);
      }
      if (args.sourceData.ADDRESS_LINE2S[addressId])
        args.vendorRequestBody.description += ' ' + args.sourceData.ADDRESS_LINE2S[addressId];
    }
  }
}
returnObj = args;