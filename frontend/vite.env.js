const dotenv = require('dotenv');
const { resolve } = require('path');

function loadEnv(mode) {
  const envFile = `.env.${mode}`;
  const envPath = resolve(process.cwd(), envFile);
  const loadedEnv = dotenv.config({ path: envPath }).parsed;

  return loadedEnv;
}

module.exports = loadEnv;
