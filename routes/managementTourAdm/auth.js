const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const panitia = require("../../data/panitia");
const { sessions } = require("../../middleware/authMiddleware");

// GET login
router.get("/login", (req, res) => {
  res.render("managementTourAdm/auth/login", {
    title: "Login Panitia",
    layout: "layouts/tour-adm-2026-layout"
  });
});

// POST login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = panitia.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.render("managementTourAdm/auth/login", {
      title: "Login Panitia",
      error: "Username atau password salah",
      layout: "layouts/tour-adm-2026-layout"
    });
  }

  const token = uuidv4();
  sessions[token] = user;

  res.cookie("auth_token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 4 // 4 jam
  });

  res.redirect("/management-tour-adm");
});

// Logout
router.get("/logout", (req, res) => {
  const token = req.cookies.auth_token;
  delete sessions[token];
  res.clearCookie("auth_token");
  res.redirect("/login");
});

module.exports = router;