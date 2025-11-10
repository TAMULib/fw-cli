const fs = require('fs');
const http = require('http');
const https = require('https');
const process = require('node:process');

function makeHttpRequest(options, data = undefined) {
  if (options.headers === undefined) {
    options.headers = {
      'Accept': '*/*'
    };
  }

  if (options.method === 'POST' && data != undefined) {
    const jsonData = JSON.stringify(data);
    console.log(jsonData);
    options.headers['Content-Type'] = 'application/json';
    options.headers['Content-Length'] = Buffer.byteLength(jsonData);
  }

  return new Promise((resolve, reject) => {
    const protocolModule = options.port === 443 ? https : http;
    const req = protocolModule.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: responseData
        });
      });
    });

    req.on('error', (error) => {
      process.exitCode = 2;

      reject(error);
    });

    if (options.method === 'POST' && data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
};

async function addModule(descriptor) {
  console.log(`Adding module ${descriptor.id}: ${descriptor.name}`);
  try {
    const response = await makeHttpRequest({
      hostname: 'localhost',
      port: 9130,
      path: '/_/proxy/modules',
      method: 'POST'
    }, descriptor);

    return response.statusCode === 201 ? response.body : response;
  } catch (error) {
    process.exitCode = 1;

    console.error('Error:', error.message);
  }
};

async function deployModule(descriptor, nodeId) {
  console.log(`Deploying module ${descriptor.id}: ${descriptor.name}`);
  try {
    const response = await makeHttpRequest({
      hostname: 'localhost',
      port: 9130,
      path: '/_/discovery/modules',
      method: 'POST'
    }, {
      srvcId: descriptor.id,
      nodeId
    });

    return response.statusCode === 201 ? response.body : response;
  } catch (error) {
    process.exitCode = 1;

    console.error('Error:', error.message);
  }
};

async function enableModule(descriptor, tenant) {
  console.log(`${tenant} enabling module ${descriptor.id}: ${descriptor.name}`);
  try {
    const response = await makeHttpRequest({
      hostname: 'localhost',
      port: 9130,
      path: `/_/proxy/tenants/${tenant}/modules`,
      method: 'POST'
    }, { id: descriptor.id });

    return response.statusCode === 201 ? response.body : response;
  } catch (error) {
    process.exitCode = 1;

    console.error('Error:', error.message);
  }
};

function readModuleDescriptor(path) {
  console.log(`Reading module descriptor at ${path}`);
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        process.exitCode = 2;

        reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
}

async function main() {

  // run from fw-cli with mod-camunda and mod-workflow target available and images built

  // get the tenant

  const tenant = 'diku';

  // get the nodeId

  const nodeId = '10.0.2.15';

  const modWorkflowDescriptorPath = './mod-workflow/target/ModuleDescriptor.json';
  const modCamundaDescriptorPath = './mod-camunda/target/ModuleDescriptor.json';

  if (!fs.existsSync(modWorkflowDescriptorPath)) {
    process.exitCode = 1;

    console.error(`mod-workflow module descriptor is required! ${modWorkflowDescriptorPath} not found`);
  }

  if (!fs.existsSync(modCamundaDescriptorPath)) {
    process.exitCode = 1;

    console.error(`mod-camunda module descriptor is required! ${modCamundaDescriptorPath} not found`);
  }

  const modWorkflowDescriptor = await readModuleDescriptor(modWorkflowDescriptorPath);
  const modCamundaDescriptor = await readModuleDescriptor(modCamundaDescriptorPath);

  if (!process.exitCode) console.log('watch okapi logs\n: docker logs okapi -n 100 -f');

  if (!process.exitCode) console.log(await addModule(modWorkflowDescriptor));
  if (!process.exitCode) console.log(await addModule(modCamundaDescriptor));

  if (!process.exitCode) console.log(await deployModule(modWorkflowDescriptor, nodeId));
  if (!process.exitCode) console.log('watch mod workflow logs\n: docker container ls | grep workflow');
  if (!process.exitCode) console.log(': docker logs <container id> -n 100 -f');
  if (!process.exitCode) console.log(await deployModule(modCamundaDescriptor, nodeId));
  if (!process.exitCode) console.log('watch mod camunda logs\n: docker container ls | grep camunda');
  if (!process.exitCode) console.log(': docker logs <container id> -n 100 -f');

  if (!process.exitCode) console.log(await enableModule(modWorkflowDescriptor, tenant));
  if (!process.exitCode) console.log(await enableModule(modCamundaDescriptor, tenant));
}

main();
