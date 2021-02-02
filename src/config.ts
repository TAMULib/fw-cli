const Conf = require('conf');

// tslint:disable: object-literal-key-quotes
const schema = {
  wd: {
    type: 'string',
    default: './fw-registry'
  },
  okapi: {
    type: 'string',
    format: 'uri',
    default: 'http://localhost:9130'
  },
  'okapi-internal': {
    type: 'string',
    format: 'uri',
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
    format: 'uuid',
    default: 'ad6d42d1-1239-526b-a997-6b96888f7719'
  },
  'mod-camunda': {
    type: 'string',
    format: 'uri',
    default: 'http://localhost:9000'
  },
  'mod-camunda-internal': {
    type: 'string',
    format: 'uri',
    default: 'http://localhost:9000'
  },
  'mod-workflow': {
    type: 'string',
    format: 'uri',
    default: 'http://localhost:9001'
  },
  'mod-workflow-internal': {
    type: 'string',
    format: 'uri',
    default: 'http://localhost:9001'
  }
};

export const projectName = 'fwcli';

export const config = new Conf({
  projectName,
  schema
});
