const Conf = require('conf');

// tslint:disable: object-literal-key-quotes
const schema = {
  wd: {
    type: 'string',
    default: './fm-workflows'
  },
  okapi: {
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
  },
  'mod-data-extractor': {
    type: 'string',
    format: 'uri',
    default: 'http://localhost:9002'
  },
  'mod-data-extractor-internal': {
    type: 'string',
    format: 'uri',
    default: 'http://localhost:9002'
  },
  'mod-external-reference-resolver': {
    type: 'string',
    format: 'uri',
    default: 'http://localhost:9003'
  },
  'mod-external-reference-resolver-internal': {
    type: 'string',
    format: 'uri',
    default: 'http://localhost:9003'
  },
  'mod-organizations-storage': {
    type: 'string',
    format: 'uri',
    default: 'http://localhost:9159'
  }
};

export const projectName = 'fmcli';

export const config = new Conf({
  projectName,
  schema
});
