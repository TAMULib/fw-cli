if (args.sourceData.ADDRESS_IDS)
  for (var i = 0; i < args.sourceData.ADDRESS_IDS.length; i++) {
    var phoneNumberObj = {};
    var addressId = args.sourceData.ADDRESS_IDS[i];

    if (isPhone(args.sourceData.ADDRESS_LINE1S[addressId])) {
      phoneNumberObj.phoneNumber = args.sourceData.ADDRESS_LINE1S[addressId];
    } else if (typeof args.sourceData.PHONE_NUMBER == 'string') {
      phoneNumberObj.phoneNumber = args.sourceData.PHONE_NUMBER;
    } else if (args.sourceData.PHONE_NUMBER) {
      phoneNumberObj.phoneNumber = args.sourceData.PHONE_NUMBER[addressId];
    }

    if (phoneNumberObj.phoneNumber) {

      var makePhoneNumber = function (pn, index) {
        if (args.sourceData.PHONE_TYPE) {
          if (Array.isArray(args.sourceData.PHONE_TYPE[addressId])) {
            pn.isPrimary = args.sourceData.PHONE_TYPE[addressId][index] === '0';
            pn.type = pn.isPrimary ? 'Other' : args.phoneTypes[args.sourceData.PHONE_TYPE[addressId][index]] ? args.phoneTypes[args.sourceData.PHONE_TYPE[addressId][index]] : 'Other';
          } else {
            pn.isPrimary = args.sourceData.PHONE_TYPE[addressId] === '0';
            pn.type = pn.isPrimary ? 'Other' : args.phoneTypes[args.sourceData.PHONE_TYPE[addressId]] ? args.phoneTypes[args.sourceData.PHONE_TYPE[addressId]] : 'Other';
          }
        } else {
          pn.type = 'Other';
        }

        pn.categories = [];

        if (args.sourceData.ORDER_ADDRESSES[addressId] === 'Y')
          pn.categories.push(args.categories.ORDER);

        if (args.sourceData.PAYMENT_ADDRESES[addressId] === 'Y')
          pn.categories.push(args.categories.PAYMENT);

        if (args.sourceData.CLAIM_ADDRESSES[addressId] === 'Y')
          pn.categories.push(args.categories.CLAIM);

        if (args.sourceData.RETURN_ADDRESSES[addressId] === 'Y')
          pn.categories.push(args.categories.RETURN);

        if (args.sourceData.OTHER_ADDRESSES[addressId] === 'Y')
          pn.categories.push(args.categories.OTHER);

        if (args.sourceData.CONTACT_NAMES[addressId] && args.vendorRequestBody.contacts.length > 0) {
          for (var j = 0; j < args.vendorRequestBody.contacts.length; j++) {
            var c = args.vendorRequestBody.contacts[j];
            if (c.firstName === args.sourceData.CONTACT_NAMES[addressId]) {
              c.phoneNumbers.push(pn);
            }
          }
        } else {
          args.vendorRequestBody.phoneNumbers.push(pn);
        }
      };

      if (Array.isArray(phoneNumberObj.phoneNumber)) {
        for (var j = 0; j < phoneNumberObj.phoneNumber.length; j++) {
          var number = phoneNumberObj.phoneNumber[j];
          makePhoneNumber({ phoneNumber: number }, j);
        }
      } else {
        makePhoneNumber({ phoneNumber: phoneNumberObj.phoneNumber });
      }

    }
  }
returnObj = args;