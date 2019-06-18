const Joi = require('joi');

const { HttpError, codes } = require('../errors').HttpError;

// schemas
const createScreenshotSchema = Joi.object({
    link: Joi.string().required(),
    options: Joi.object().keys({
      fullPage: Joi.boolean().required(),
      width: Joi.number().required(),
      height: Joi.number().required(),
      timeout: Joi.number().required(),
    }).required(),
  })
    .required()
;

const validateHandler = (data, schema) => {

  const { error, value } = Joi.validate(data, schema);

  if (error) {
    throw new HttpError({
      statusCode: codes.BAD_REQUEST,
      message: `Input data not valid: ${error.message}`,
      data: { instance: error, }
    })
  }

  return value;
};


module.exports = {
  schema: {
    createScreenshot: createScreenshotSchema,
  },
  validate: validateHandler,
};