if (args.sourceData.address_ids) {
  for (var i = 0; i < args.sourceData.address_ids.length; i++) {
    var address = {};
    var addressId = args.sourceData.address_ids[i];
    if (args.sourceData.contact_titles[addressId]) {
      address.addressLine1 = args.sourceData.contact_titles[addressId] + ' ' + args.sourceData.address_line1s[addressId];
    } else {
      address.addressLine1 = args.sourceData.address_line1s[addressId];
    }

    if (
      (!isEmailLike(address.addressLine1) && !isURLLike(address.addressLine1))
    ) {
      var lines = [];
      lines.push(args.sourceData.address_line2s[addressId]);
      lines.push(args.sourceData.address_line3s[addressId]);
      lines.push(args.sourceData.address_line4s[addressId]);
      lines.push(args.sourceData.address_line5s[addressId]);

      address.addressLine2 = '';
      for (var k = 0; k < lines.length; k++) {
        if (lines[k]) {
          if (k > 0 && address.addressLine2) {
            address.addressLine2 += ' ';
          }
          address.addressLine2 += lines[k];
        }
      }

      address.city = args.sourceData.cities[addressId];
      address.stateRegion = args.sourceData.state_provinces[addressId];
      address.zipCode = args.sourceData.zip_postals[addressId];
      var country = args.countryCodes[args.sourceData.countries[addressId]];
      address.country = country ? country : '';
      address.categories = [];

      if (args.sourceData.order_addresses[addressId] === 'Y')
        address.categories.push(args.categories.ORDER);

      if (args.sourceData.payment_addreses[addressId] === 'Y')
        address.categories.push(args.categories.PAYMENT);

      if (args.sourceData.claim_addresses[addressId] === 'Y')
        address.categories.push(args.categories.CLAIM);

      if (args.sourceData.return_addresses[addressId] === 'Y')
        address.categories.push(args.categories.RETURN);

      if (args.sourceData.other_addresses[addressId] === 'Y')
        address.categories.push(args.categories.OTHER);

      if (args.sourceData.contact_names[addressId] && args.vendorRequestBody.contacts.length > 0) {
        for (var j = 0; j < args.vendorRequestBody.contacts.length; j++) {
          var c = args.vendorRequestBody.contacts[j];
          if (c.firstName === args.sourceData.contact_names[addressId]) {
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