const nconf = require('nconf');
const Joi = require('joi');

require('dotenv').config();
nconf.argv().env();

const allowedEnvironments = ['development', 'staging', 'production'];

if(!nconf.get('NODE_ENV')) {
  throw new Error("NODE_ENV param not defined! \nPlease use one of these: " + allowedEnvironments.join(', '));
}

// validation for the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().allow(allowedEnvironments).default('development'),
  PORT: Joi.number().default(80),
  LOGGER_ENABLED: Joi.boolean().default(false),
  DEBUG: Joi.string().default(''),

  // API_KEY: Joi.string().required(),

  // mongodb
  // MONGODB_HOST: Joi.string().required(),
  // MONGODB_NAME: Joi.string().required(),
  // MONGODB_USER: Joi.string().required(),
  // MONGODB_PASS: Joi.string().required(),
  MONGODB_URL: Joi.string().required(),
  MONGOOSE_DEBUG: Joi.boolean().default(false),

  // rabbitMQ
  AMQP_URL: Joi.string().required(),
  AMQP_QUEUE_SCREENSHOTS: Joi.string().required(),

  // miniO S3
  MINIO_ENDPOINT: Joi.string().required(),
  MINIO_PORT: Joi.number().required(),
  MINIO_SSL: Joi.boolean().required(),
  MINIO_ACCESS_KEY: Joi.string().required(),
  MINIO_SECRET_KEY: Joi.string().required(),
  MINIO_BUCKET_SCREENSHOTS: Joi.string().required(),
})
  .unknown()
  .required()
;

const { error, value: envVars } = Joi.validate(nconf.get(), envVarsSchema);

if (error) { throw new Error(`Config validation error: ${error.message}`); }

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  loggerEnabled: envVars.LOGGER_ENABLED,
  debug: envVars.DEBUG,

  auth: {
    jwt: { secret: 'VERY_SECRET' },
    // apiKey: envVars.API_KEY,
  },

  db: {
    mongo: {
      // url: `mongodb://${envVars.MONGODB_USER}:${envVars.MONGODB_PASS}@${envVars.MONGODB_HOST}/${envVars.MONGODB_NAME}`,
      url: envVars.MONGODB_URL,
      mongoose: {
        debug: envVars.MONGOOSE_DEBUG,
      },
    },
  },

  amqp: {
    url: envVars.AMQP_URL,
    queue: {
      screenshots: {
        name: envVars.AMQP_QUEUE_SCREENSHOTS,
        options: {},
      },
    }
  },

  miniO: {
    client: {
      endPoint: envVars.MINIO_ENDPOINT,
      port: envVars.MINIO_PORT,
      useSSL: envVars.MINIO_SSL,
      accessKey: envVars.MINIO_ACCESS_KEY,
      secretKey: envVars.MINIO_SECRET_KEY,
    },
    bucket: {
      screenshots: envVars.MINIO_BUCKET_SCREENSHOTS,
    }
  }
};

if (config.env === 'development') {
  console.log('======================== Config ========================');
  console.log(config);
  console.log('========================================================');
}

module.exports = config;
