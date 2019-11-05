const Conf = require('conf');

const schema = {
  wd: {
    type: 'string',
    default: './workflows'
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
  modCamunda: {
    type: 'string',
    format: 'uri',
    default: 'http://localhost:9000'
  },
  modWorkflow: {
    type: 'string',
    format: 'uri',
    default: 'http://localhost:9001'
  },
  modDataExtractor: {
    type: 'string',
    format: 'uri',
    default: 'http://localhost:9002'
  },
  modExternalReferenceResolver: {
    type: 'string',
    format: 'uri',
    default: 'http://localhost:9003'
  }
};

export const projectName = 'fmcli';

export const config = new Conf({
  projectName,
  schema
});
