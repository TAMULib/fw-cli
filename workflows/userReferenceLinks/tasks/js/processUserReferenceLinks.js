var userTypes = {
  AMDB: {
    'id': 'fb86289b-001d-4a6f-8adf-5076b162a6c7',
    'name': 'USER_AMDB'
  },
  AMDB_UIN: {
    'id': '0ed6f994-8dbd-4827-94c0-905504169c90',
    'name': 'USER_AMDB_UIN'
  },
  MSDB: {
    'id': '7a244692-dc96-48f1-9bf8-39578b8fee45',
    'name': 'USER_MSDB'
  },
  MSDB_UIN: {
    'id': '426ce32f-388c-4edf-9c79-d6b8348148a0',
    'name': 'USER_MSDB_UIN'
  }
};

var newUUID = UUID.randomUUID().toString();

var userReferenceLinks = [];
userReferenceLinks.push({
  'folioReference': newUUID,
  'externalReference': args.ID,
  'type': userTypes[args.SCHEMA.toUpperCase()]
});

userReferenceLinks.push({
  'folioReference': newUUID,
  'externalReference': args.EXTERNAL_SYSTEM_ID,
  'type': userTypes[args.SCHEMA.toUpperCase() + "_UIN"]
});

if (args.SCHEMA.toUpperCase() === 'AMDB' && args.MSDB_EXTERNAL_SYSTEM_ID) {
  userReferenceLinks.push({
    'folioReference': newUUID,
    'externalReference': args.MSDB_EXTERNAL_SYSTEM_ID,
    'type': userTypes.MSDB_UIN
  });
  userReferenceLinks.push({
    'folioReference': newUUID,
    'externalReference': args.MSDB_ID,
    'type': userTypes.MSDB
  });
}

var returnObj = userReferenceLinks;