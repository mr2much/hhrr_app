const Joi = require('joi');

module.exports.candidatoValidationSchema = Joi.object({
  candidato: Joi.object({
    cedula: Joi.string().required(),
    nombres: Joi.string().required(),
    apellidos: Joi.string().required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      .required(),
    dob: Joi.date().required(),
    candidateProfile: Joi.string().required(),
    nivelAcademico: Joi.string().required(),
    countryRegionData: Joi.object({
      country: Joi.string().required(),
      region: Joi.string().required(),
    }).required(),
  })
    .required()
    .options({ allowUnknown: true }),
});
