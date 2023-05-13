function errorHandler(err, req, res, next) {
  if (req.accepts('json')) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(err.statusCode).send(`<h1>${err.message}</h1>`);
  }
}

module.exports = errorHandler;
