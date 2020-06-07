module.exports = (app) => {
  app.use('/api', (req, res, next) => {
    next();
  });
  require('./users')(app);
  require('./aregions')(app);
};
