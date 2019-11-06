if (args.sourceData.address_ids)
  for (var i = 0; i < args.sourceData.address_ids.length; i++) {
    var phoneNumberObj = {};
    var addressId = args.sourceData.address_ids[i];

    if (isPhone(args.sourceData.address_line1s[addressId])) {
      phoneNumberObj.phoneNumber = args.sourceData.address_line1s[addressId];
    } else if (typeof args.sourceData.phone_number == 'string') {
      phoneNumberObj.phoneNumber = args.sourceData.phone_number;
    } else if (args.sourceData.phone_number) {
      phoneNumberObj.phoneNumber = args.sourceData.phone_number[addressId];
    }

    if (phoneNumberObj.phoneNumber) {

      var makePhoneNumber = function (pn, index) {
        if (args.sourceData.phone_type) {
          if (Array.isArray(args.sourceData.phone_type[addressId])) {
            pn.isPrimary = args.sourceData.phone_type[addressId][index] === '0';
            pn.type = pn.isPrimary ? 'Other' : args.phoneTypes[args.sourceData.phone_type[addressId][index]] ? args.phoneTypes[args.sourceData.phone_type[addressId][index]] : 'Other';
          } else {
            pn.isPrimary = args.sourceData.phone_type[addressId] === '0';
            pn.type = pn.isPrimary ? 'Other' : args.phoneTypes[args.sourceData.phone_type[addressId]] ? args.phoneTypes[args.sourceData.phone_type[addressId]] : 'Other';
          }
        } else {
          pn.type = 'Other';
        }

        pn.categories = [];

        if (args.sourceData.order_addresses[addressId] === 'Y')
          pn.categories.push(args.categories.ORDER);

        if (args.sourceData.payment_addreses[addressId] === 'Y')
          pn.categories.push(args.categories.PAYMENT);

        if (args.sourceData.claim_addresses[addressId] === 'Y')
          pn.categories.push(args.categories.CLAIM);

        if (args.sourceData.return_addresses[addressId] === 'Y')
          pn.categories.push(args.categories.RETURN);

        if (args.sourceData.other_addresses[addressId] === 'Y')
          pn.categories.push(args.categories.OTHER);

        if (args.sourceData.contact_names[addressId] && args.vendorRequestBody.contacts.length > 0) {
          for (var j = 0; j < args.vendorRequestBody.contacts.length; j++) {
            var c = args.vendorRequestBody.contacts[j];
            if (c.firstName === args.sourceData.contact_names[addressId]) {
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