if (args.sourceData.account_ids)
  for (var i = 0; i < args.sourceData.account_ids.length; i++) {
    var account = {};
    var account_id = args.sourceData.account_ids[i];
    account.name = args.sourceData.account_names[account_id] ? args.sourceData.account_names[account_id] : '';
    account.accountNo = args.sourceData.account_numbers[account_id] ? args.sourceData.account_numbers[account_id] : '';
    account.accountStatus = args.sourceData.account_statuses[account_id] ? args.statuses[args.sourceData.account_statuses[account_id]] : args.statuses[1];
    account.paymentMethod = args.sourceData.deposits[account_id] === 'Y' ? 'Deposit Account' : 'EFT';
    account.notes = args.sourceData.account_notes[account_id] ? args.sourceData.account_notes[account_id] : '';
    account.libraryCode = '';
    account.libraryEdiCode = '';
    args.vendorResponseBody.accounts.push(account);
  }
returnObj = args;