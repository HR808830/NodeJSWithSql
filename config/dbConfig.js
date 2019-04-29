module.exports = {
  development: {
    username: "root",
    password: "root@123Root",
    database: "mysqlDemo",
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    dialectOptions: {
      useUTC: false
    },
  },
  production: {
    username: "root",
    password: null,
    database: null,
    host: "127.0.0.1",
    port: 3306,
    dialect: "mysql"
  },
  test: {
    username: "root",
    password: null,
    database: null,
    host: "127.0.0.1",
    port: 3306,
    dialect: "mysql"
  }
};