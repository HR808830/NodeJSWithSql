"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const basename = path.basename(__filename);
const {
  db: dbConfig,
  env
} = require("../config/index");
const db = {};

let sequelize;

sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: false,
    freezeTableName: true,
    operatorsAliases: false
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log(`Successfully connected to the DB...`);
  })
  .catch(e => {
    console.log(`Error while connecting to the DB ${e}`);
  });

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(file => {
    const model = sequelize["import"](path.join(__dirname, file));

    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.Op = Op;
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require("../models/User")(sequelize, Sequelize);

module.exports = db;