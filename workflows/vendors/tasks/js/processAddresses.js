if (args.sourceData.ADDRESS_IDS) {
  for (var i = 0; i < args.sourceData.ADDRESS_IDS.length; i++) {
    var address = {};
    var addressId = args.sourceData.ADDRESS_IDS[i];
    if (args.sourceData.CONTACT_TITLES[addressId]) {
      address.addressLine1 = args.sourceData.CONTACT_TITLES[addressId] + ' ' + args.sourceData.ADDRESS_LINE1S[addressId];
    } else {
      address.addressLine1 = args.sourceData.ADDRESS_LINE1S[addressId];
    }

    if (
      (!isEmailLike(address.addressLine1) && !isURLLike(address.addressLine1))
    ) {
      var lines = [];
      lines.push(args.sourceData.ADDRESS_LINE2S[addressId]);
      lines.push(args.sourceData.ADDRESS_LINE3S[addressId]);
      lines.push(args.sourceData.ADDRESS_LINE4S[addressId]);
      lines.push(args.sourceData.ADDRESS_LINE5S[addressId]);

      address.addressLine2 = '';
      for (var k = 0; k < lines.length; k++) {
        if (lines[k]) {
          if (k > 0 && address.addressLine2) {
            address.addressLine2 += ' ';
          }
          address.addressLine2 += lines[k];
        }
      }

      address.city = args.sourceData.CITIES[addressId];
      address.stateRegion = args.sourceData.STATE_PROVINCES[addressId];
      address.zipCode = args.sourceData.ZIP_POSTALS[addressId];
      var country = args.countryCodes[args.sourceData.COUNTRIES[addressId]];
      address.country = country ? country : '';
      address.categories = [];

      if (args.sourceData.ORDER_ADDRESSES[addressId] === 'Y')
        address.categories.push(args.categories.ORDER);

      if (args.sourceData.PAYMENT_ADDRESES[addressId] === 'Y')
        address.categories.push(args.categories.PAYMENT);

      if (args.sourceData.CLAIM_ADDRESSES[addressId] === 'Y')
        address.categories.push(args.categories.CLAIM);

      if (args.sourceData.RETURN_ADDRESSES[addressId] === 'Y')
        address.categories.push(args.categories.RETURN);

      if (args.sourceData.OTHER_ADDRESSES[addressId] === 'Y')
        address.categories.push(args.categories.OTHER);

      if (args.sourceData.CONTACT_NAMES[addressId] && args.vendorRequestBody.contacts.length > 0) {
        for (var j = 0; j < args.vendorRequestBody.contacts.length; j++) {
          var c = args.vendorRequestBody.contacts[j];
          if (c.firstName === args.sourceData.CONTACT_NAMES[addressId]) {
            c.addresses.push(address);
          }
        }
      } else {
        args.vendorRequestBody.addresses.push(address);
      }
    }
  }
}
returnObj = args;