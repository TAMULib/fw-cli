const Conf = require('conf');

// tslint:disable: object-literal-key-quotes
const schema = {
  wd: {
    type: 'string',
    default: './fw-registry'
  },
  okapi: {
    type: 'string',
    default: 'http://localhost:9130'
  },
  okapi_login_path: {
    type: 'string',
    default: '/authn/login'
  },
  tenant: {
    type: 'string',
    default: 'diku'
  },
  token: {
    type: 'string',
    default: ''
  },
  username: {
    type: 'string',
    default: 'diku_admin'
  },
  password: {
    type: 'string',
    default: 'admin'
  },
  userId: {
    type: 'string',
    default: ''
  },
  'mod-workflow': {
    type: 'string',
    default: 'http://localhost:9001'
  },
  'access': {
    type: 'string',
    enum: ['okapi', 'mod-workflow'],
    default: 'mod-workflow'
  }
};

export const projectName = 'fwcli';

export const config = new Conf({
  projectName,
  schema
});
