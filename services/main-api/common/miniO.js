const Minio = require('minio');

const config = require('../config');
const logger = require('./logger');

const minioClient = new Minio.Client(config.miniO.client);

createBucketOnTotExists();

module.exports = {
  client: minioClient,
  saveScreenshot: (pathName, buffer) => new Promise((resolve, reject) => {
    const bucketName = config.miniO.bucket.screenshots;
    const metaInfo = {
      'Content-Type': 'image/png',
    };
    minioClient.putObject(
      bucketName,
      pathName,
      buffer,
      metaInfo,
      (error) => {
        if (error) {
          logger.error(`[Minio] save to '${bucketName}/${pathName}'`, error);
          return reject(error);
        }
        return resolve();
      }
    )
  }),

  deleteScreenshot: (pathName) => new Promise((resolve, reject) => {
    const bucketName = config.miniO.bucket.screenshots;

    minioClient.removeObject(
      bucketName,
      pathName,
      (error) => {
        if (error) {
          logger.error(`[Minio] remove fromo '${bucketName}/${pathName}'`, error);
          return reject(error);
        }
        return resolve();
      }
    )
  }),
};

function createBucketOnTotExists() {
  const bucketName = config.miniO.bucket.screenshots;

  minioClient.bucketExists(
    bucketName,
    (err, exists) => {
      if (err) {
        return logger.error('[Minio] check bucket error', err)
      }
      if (!exists) {
        minioClient.makeBucket(
          bucketName,
          (error) =>
            error
              ? logger.error('[Minio] on create bucket error', error)
              : logger.info(`[Minio] bucket '${bucketName}' created!`)
        )
      }
    }
  );
}