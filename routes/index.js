module.exports = (app) => {
  app.use('/api', (req, res, next) => {
    console.log('middleware api request');
    next();
  });
  require('./users')(app);
};
