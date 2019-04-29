const bCrypt = require("bcrypt-nodejs");

exports.validPassword = (password, dbPassword) => {
  return bCrypt.compareSync(password, dbPassword);
};

exports.generateHash = password => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
};