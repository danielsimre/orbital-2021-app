// If user is authenticated, proceed
// Else, redirect them to login
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/api/v1/users/login");
}
export default ensureAuthenticated;
