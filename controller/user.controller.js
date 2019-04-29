const userService = require("../middleware/user.service");
const db = require("../models/index");
const User = db.User;
const atob = require("atob");
const bcryptService = require("../middleware/bcryptService");


// User.sync({
//   force: true
// });

exports.register = (req, res, next) => {
  let params = req.body;
  if (params.email && params.username && params.password) {
    userService.register(req.body, next, (err, data) => {
      if (err) next(err);
      return res.status(data.status).json({
        message: data.message,
        token: data.token,
        username: data.username,
      });
    });
  } else {
    return res.status(400).json({
      message: "You Are not register. Please try again later"
    });
  }

};

exports.login = (req, res, next) => {
  let params = req.body;
  if (params.email && params.password) {
    userService.login(req.body, next, (err, data) => {
      if (err) next(err);
      return res.status(data.status).json({
        message: data.message,
        token: data.token,
        username: data.username,
        isSubscribed: data.isSubscribed
      });
    });
  } else {
    return res.status(400).json({
      message: "Unauthorized Data"
    });
  }
};

exports.resetPassword = (req, res, next) => {
  try {
    User.findOne({
      where: {
        id: req.user.id
      }
    }).then(user => {
      if (user) {
        if (req.body.newPassword === req.body.verifyPassword) {
          let decrypt = atob(req.body.newPassword);
          let password = bcryptService.generateHash(decrypt);
          user.update({
            password: password,
          });
          return res.status(200).json({
            message: "Password reset successfully"
          });
        } else {
          return res.status(422).json({
            message: "Passwords do not match"
          });
        }
      } else {
        return res.status(404).json({
          message: "User Not Found"
        });
      }
    }).catch(e => {
      next(e);
    });

  } catch (error) {
    next(error);
  }
};