var cleanContact = [];
for (var i = 0; i < args.vendorResponseBody.contacts.length; i++) {
  var c = args.vendorResponseBody.contacts[i];
  if (typeof c === 'string') cleanContact.push(c);
}
args.vendorResponseBody.contacts = cleanContact;

returnObj = args.vendorResponseBody;