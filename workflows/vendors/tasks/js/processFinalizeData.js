var cleanContact = [];
for (var i = 0; i < args.vendorRequestBody.contacts.length; i++) {
  var c = args.vendorRequestBody.contacts[i];
  if (typeof c === 'string') cleanContact.push(c);
}
args.vendorRequestBody.contacts = cleanContact;

returnObj = args.vendorRequestBody;