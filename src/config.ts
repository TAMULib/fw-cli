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
    default: 'e4252f55-cc7e-5e1e-a17e-7bfc16706a77'
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
