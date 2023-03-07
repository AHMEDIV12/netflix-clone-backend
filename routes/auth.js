const router = require("express").Router();
const User = require("../modules/User");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: CryptoJs.AES.encrypt(req.body.password, process.env.SECRET_KEY),
  });
  const user = await newUser.save();
  res.status(200).json(user);
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json("wrong email or password");
    } 
    else
    {
      const bytes = CryptoJs.AES.decrypt(user.password, process.env.SECRET_KEY);
      const originalPassword = bytes.toString(CryptoJs.enc.Utf8);
      
      if (originalPassword != req.body.password) {
        res.status(401).json("wrong email or password");
      }
      else 
      {
        const accessToken = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.SECRET_KEY,
          { expiresIn: "5d" }
        );
        const { password, ...info } = user._doc;
        res.status(200).json({ ...info, accessToken });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
