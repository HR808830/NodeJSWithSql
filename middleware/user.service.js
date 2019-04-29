const db = require("../models/index");
const User = db.User;
const Op = db.Op;
const jwt = require("jsonwebtoken");
const config = require("../config");
const bcryptService = require("../middleware/bcryptService");
const atob = require("atob");

exports.login = (params, next, cb) => {
  User.findOne({
      where: {
        [Op.or]: [{
          email: params.email
        }, {
          username: params.username
        }]
      }
    })
    .then(user => {
      if (user) {
        let password = atob(params.password);
        if (
          user.password !== null &&
          bcryptService.validPassword(password, user.password)
        ) {
          let userDetail = {
              id: user.id,
              email: user.email,
              username: user.username
            }
          const refreshToken = jwt.sign(userDetail, config.jwtSecret);
          const authToken = jwt.sign(userDetail, config.jwtSecret, {
             expiresIn: config.jwtExpiresIn // expires in 20 minutes
          });

          let data = {
            status: 200,
            token: authToken,
            message: "Success",
          };
          cb(null, data);
        } else {
          let data = {
            status: 404,
            token: null,
            username: null,
            message: "Entered Password is Wrong"
          };
          cb(null, data);
        }
      } else {
        let data = {
          status: 404,
          token: null,
          username: null,
          message: "Email Not Found"
        };
        cb(null, data);
      }
    })
    .catch(e => {
      next(e);
    });
};

exports.register = (params, next, cb) => {
  User.findOne({
      where: {
        [Op.or]: [{
          email: params.email
        }, {
          username: params.username
        }]
      }
    })
    .then(user => {
      if (user) {
        if (user.email === params.email) {
          let data = {
            status: 404,
            token: null,
            username: null,
            message: "Email Already Exists."
          };
          cb(null, data);
        } else {
          let data = {
            status: 404,
            token: null,
            username: null,
            message: "Username Already Exists."
          };
          cb(null, data);
        }
      } else {
        let decrypt = atob(params.password);
        let password = bcryptService.generateHash(decrypt);
        User.create({
            email: params.email,
            password: password,
            username: params.username
          })
          .then(result => {
            if (result) {
              let userDetail = {
                  id: result.id,
                  email: result.email,
                  username: result.username
              }
              const refreshToken = jwt.sign(userDetail, config.jwtSecret);
              const authToken = jwt.sign(userDetail, config.jwtSecret, {
                 expiresIn: config.jwtExpiresIn // expires in 
              });
              User.update({refreshToken: refreshToken});
              let data = {
                status: 200,
                token: authToken,
                username: result.username,
                message: "User Registered"
              };
              cb(null, data);
            } else {
              let data = {
                status: 404,
                token: token,
                username: null,
                message: "User Not Registered"
              };
              cb(null, data);
            }
          })
          .catch(e => {
            console.log(e);

            next(e);
          });
      }
    })
    .catch(e => {
      console.log(e);

      next(e);
    });
};