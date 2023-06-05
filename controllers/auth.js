const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.signup = (req, res, next) => {
  console.log("🚀 ~ file: auth.js:6 ~ req:", req);
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const contact = req.body.contact;

  User.findOne({ email: email }).then((user) => {
    console.log("User: ", user);
    if (user) {
      const err = new Error("Email already exists");
      err.statusCode = 403;
      return next(err);
    } else {
      bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            name: name,
            password: hashedPassword,
            contact: contact,
          });
          return user.save();
        })
        .then((result) => {
          const token = jwt.sign(
            {
              email: result.email,
              userId: result._id.toString(),
            },
            "secretKey",
            { expiresIn: "100h" }
          );
          res.status(201).json({
            message: "User Created",
            userId: result._id,
            token: token,
            userEmail: email,
            userName: name,
          });
        })
        .catch((err) => {
          next(err);
        });
    }
  });
};

exports.signin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const findUser = await User.findOne({ email: email });
    if (findUser) {
      const Password = await bcrypt.compare(password, findUser.password);
      if (Password) {
        const token = jwt.sign(
          {
            email: findUser.email,
            userId: findUser._id,
          },
          "secretKey",
          { expiresIn: "100h" }
        );
        res.status(200).json({
          token: token,
          userId: findUser._id,
          userName: findUser.name,
          userEmail: findUser.email,
        });
      } else {
        next({ message: "Password is Incorrect!" });
      }
    } else {
      res.status(401).json({
        message: "User not found",
      });
    }
  } catch (e) {
    next(e);
  }
};

exports.verifyToken = (req, res, next) => {
  const token = req.body.token;
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secretKey");
    res.json({ message: "Token verified." });
  } catch (error) {
    const err = new Error("Token expired. Please sign in again to continue");
    err.statusCode = 401;
    next(err);
  }
};
