function notFound(req, res, next) {
  res.status(404);

  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode);
  res.render('error', {
    title: 'Error Page',
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    status: statusCode,
  });
}

module.exports = {
  notFound,
  errorHandler,
};
