if (args.patronGroups[args.sourceData.PATRON_GROUP_CODE]) {
  args.userRequestBody.patronGroup = args.patronGroups[args.sourceData.PATRON_GROUP_CODE];
} else {
  args.userRequestBody.patronGroup = args.patronGroups['other'];
}

returnObj = args.userRequestBody;