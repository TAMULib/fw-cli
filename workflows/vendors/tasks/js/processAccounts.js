if (args.sourceData.ACCOUNT_IDS)
  for (var i = 0; i < args.sourceData.ACCOUNT_IDS.length; i++) {
    var account = {};
    var account_id = args.sourceData.ACCOUNT_IDS[i];
    account.name = args.sourceData.ACCOUNT_NAMES[account_id] ? args.sourceData.ACCOUNT_NAMES[account_id] : '';
    account.accountNo = args.sourceData.ACCOUNT_NUMBERS[account_id] ? args.sourceData.ACCOUNT_NUMBERS[account_id] : '';
    account.accountStatus = args.sourceData.ACCOUNT_STATUSES[account_id] ? args.statuses[args.sourceData.ACCOUNT_STATUSES[account_id]] : args.statuses[1];
    account.paymentMethod = args.sourceData.DEPOSITS[account_id] === 'Y' ? 'Deposit Account' : 'EFT';
    account.notes = args.sourceData.ACCOUNT_NOTES[account_id] ? args.sourceData.ACCOUNT_NOTES[account_id] : '';
    account.libraryCode = '';
    account.libraryEdiCode = '';
    args.vendorRequestBody.accounts.push(account);
  }
returnObj = args;