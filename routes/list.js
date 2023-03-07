const List = require("../modules/List");
const verify = require("../verifyToken");
const router = require("express").Router();

// create
router.post("/create", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newList = new List(req.body);
    const list = await newList.save();
    res.status(200).json(list);
  } else {
    res.status(403).json("you are not allowed");
  }
});

// update
router.post("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedlist = await List.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedlist);
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("you are not allowed");
  }
});

// delete

router.delete("/delete/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await List.findByIdAndDelete(req.params.id);
      res.status(200).json("List has been deleted");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("not allowed");
  }
});

// get

router.get("/find/:id", verify, async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    res.status(200).json(list);
  } catch (error) {
    return res.status(500).json(error);
  }
});
// get all

router.get("/alllists", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const list = await List.find();
      res.status(200).json(list.reverse());
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("you are not allowed");
  }
});

// get random list
router.get("/random", verify, async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;
  let list = [];
  try {
    if (typeQuery) {
      if (genreQuery) {
        list = await List.aggregate([
          { $match: { type: typeQuery, genre: genreQuery } },
          { $sample: 10 },
        ]);
      } else {
        list = await List.aggregate([
          { $match: { type: typeQuery } },
          { $sample: 10 },
        ]);
      }
      res.status(200).json(list);
    } else {
      list = await List.aggregate([{ $sample: 10 }]);
      res.status(200).json(list);
    }
  } catch (error) {
    return res.status(500).json(error);
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
          month: { $year: "$createdAt" },
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
