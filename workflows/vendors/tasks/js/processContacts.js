if (args.sourceData.ADDRESS_IDS)
  for (var i = 0; i < args.sourceData.ADDRESS_IDS.length; i++) {
    var addressId = args.sourceData.ADDRESS_IDS[i];
    if (args.sourceData.CONTACT_NAMES[addressId]) {
      var contact = {};
      contact.firstName = args.sourceData.CONTACT_NAMES[addressId];
      contact.lastName = "";
      contact.addresses = [];
      contact.phoneNumbers = [];
      contact.emails = [];
      contact.urls = [];

      contact.categories = [];

      if (args.sourceData.ORDER_ADDRESSES[addressId] === 'Y')
        contact.categories.push(args.categories.ORDER);

      if (args.sourceData.PAYMENT_ADDRESES[addressId] === 'Y')
        contact.categories.push(args.categories.PAYMENT);

      if (args.sourceData.CLAIM_ADDRESSES[addressId] === 'Y')
        contact.categories.push(args.categories.CLAIM);

      if (args.sourceData.RETURN_ADDRESSES[addressId] === 'Y')
        contact.categories.push(args.categories.RETURN);

      if (args.sourceData.OTHER_ADDRESSES[addressId] === 'Y')
        contact.categories.push(args.categories.OTHER);

      args.vendorRequestBody.contacts.push(contact);
    }
  }
returnObj = args;