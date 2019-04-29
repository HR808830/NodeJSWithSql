const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validate = require("express-validation");
const userController = require("../controller/user.controller");

const checkAuth = require("../middleware/check-auth");

const paramsValidation = {
  register: {
    body: {
      email: Joi.string()
        .email({
          minDomainAtoms: 2
        })
        .required(),
      password: Joi.string().required()
    }
  },
  resetPassword: {
    body: {
      newPassword: Joi.string().required(),
      verifyPassword: Joi.string().required(),
    }
  }
};

router
  .route("/login")
  .post(validate(paramsValidation.register), userController.login);

router
  .route("/register")
  .post(validate(paramsValidation.register), userController.register);


router
  .route("/resetPassword")
  .post(
    validate(paramsValidation.resetPassword), checkAuth,
    userController.resetPassword
  );

module.exports = router;