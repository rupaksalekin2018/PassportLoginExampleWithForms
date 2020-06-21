module.exports = {
  ensureAdminAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    req.flash(
      "error_msg",
      "Please Login With Credentials To View The Resource!"
    );
    res.redirect("/users/admin/login");
  },
};
