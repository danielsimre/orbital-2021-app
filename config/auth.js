// If user is authenticated, proceed
// Else, redirect them to login
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({
    msg: "Failed to authenticate, please login",
    isAuthenticated: false,
  });
}
export default ensureAuthenticated;
