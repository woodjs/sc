var config = {
  db: {
    connectStringList: [
      'mongodb://127.0.0.1:27017/error'
    ]
  },
  server: {
    host: '127.0.0.1',
    port: 3001
  },
  session: {
    secret: 'test',
    name: 'test',
    rolling: true,
    cookie: {
      maxAge: 1000 * 60 * 30
    },
    resave: false,
    saveUninitialized: true,
    storeUrl: 'mongodb://127.0.0.1:27017/session'
  }
};

module.exports = config;