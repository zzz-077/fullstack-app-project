async function checkAutentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("user/signin");
}
export default checkAutentication;
