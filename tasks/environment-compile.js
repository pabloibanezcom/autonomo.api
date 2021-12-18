const fs = require('fs');
const dotenv = require('dotenv');

module.exports = _environment => {
  dotenv.config();
  const envPrefixes = {
    production: 'PROD',
    integration: 'INT',
    staging: 'STG',
    development: 'DEV'
  };

  environment = ['production', 'integration', 'staging', 'development'].includes(_environment) ? _environment : null;

  if (!environment) {
    process.env.NODE_ENV = 'development';
  }

  Object.keys(process.env).forEach(envName => {
    if (envName.startsWith(envPrefixes[environment])) {
      process.env[envName.replace(`${envPrefixes[environment]}_`, '')] = process.env[envName];
    }
  });

  if (environment) {
    console.log(`Environment name: ${environment}`);
  }

  fs.writeFileSync('./dist/environmentVars.json', JSON.stringify(process.env, null, 2));
};
