// middleware function for logging the request

function requestLog(req, res, next) {
  console.log(req);
  next();
}
