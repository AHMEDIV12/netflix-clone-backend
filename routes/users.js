const CryptoJs = require("crypto-js");
const User = require("../modules/User");
const verify = require("../verifyToken");
const router = require("express").Router();

// update
router.put("/:id", verify, async (req, res) => {
  if (req.user.id == req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = CryptoJs.AES.decrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json(req.user);
  }
});

// delete

router.delete("/delete/:id", verify, async (req, res) => {
  if (req.user.id == req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("user has been deleted");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json(req.user);
  }
});

// get

router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...info } = user._doc;
    res.status(200).json(info);
  } catch (error) {
    return res.status(500).json(error);
  }
});
// get all

router.get("/allusers/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const query = req.query.new;
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(3)
        : await User.find();
      res.status(200).json(users);
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("you are not allowed");
  }
});

// users stats
router.get("/stats", async (req, res) => {
  const today = new Date();
  const lastYear = today.setFullYear(today.getFullYear() - 1);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  try {
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt"},
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
