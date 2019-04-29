const jwt = require("jsonwebtoken");
const config = require("../config/index");

module.exports = (req, res, next) => {
  let oldTokenData;
  try {
    const token = req.headers.authorization;
    if (token) {
      // const decoded = jwt.verify(token, config.jwtSecret);
      // req.user = decoded;

      // next();


      jwt.verify(token, config.jwtSecret, function (err, decoded) {
        if (err) {
          if (err.message === 'jwt expired') {
            const user_id = this.oldTokenData.id;
            User.findOne({ where: { id: user_id} }).then(data => {
              const refreshToken = data.refreshToken;
              jwt.verify(refreshToken, config.jwtSecret, (err, decoded) => {
                if (err) {
                    return res.status(403).send({
                        success: false,
                        message: 'No token provided.',
                        data: null
                    });
                } else {
                    console.log('refreshTokenData ==== ', decoded);
                    const newAccessToken = jwt.sign(decoded._doc, config.jwtSecret, {
                        expiresIn: config.accessTokenExpireTime // expires in 20 sec
                    });

                    req.user = this.oldTokenData;
                    this.oldTokenData = this.oldTokenData;
                    res.send({'token': newAccessToken});
                    next();
                }
              });
            }).catch((err) => {
              return res.status(404).json({
                  success: false,
                  message: err.message,
                  data: null
              });
            })
          }
        } else {
            req.user = decoded._doc;
            this.oldTokenData = decoded._doc;
            next();
        }
      });
    } else {
      return res.status(404).json({
        message: "Token Not Provided ."
      });
    }
  } catch (error) {
    return res.status(401).json({
      error: {
        message: error.message
      }
    });
  }
};