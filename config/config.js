var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'team-crud'
    },
    port: 3000,
    db: 'mongodb://localhost/team-crud-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'team-crud'
    },
    port: 3000,
    db: 'mongodb://localhost/team-crud-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'team-crud'
    },
    port: 3000,
    db: 'mongodb://localhost/team-crud-production'
  }
};

module.exports = config[env];
