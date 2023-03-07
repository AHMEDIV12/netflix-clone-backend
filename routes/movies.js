const Movie = require("../modules/movie");
const verify = require("../verifyToken");
const router = require("express").Router();

// create
router.post("/create", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = new Movie(req.body);
    const movie = await newMovie.save();
    res.status(200).json(movie);
  } else {
    res.status(403).json("you are not allowed");
  }
});

// update
router.post("/:id", verify, async (req, res) => {
  if (req.movie.id == req.params.id || req.user.isAdmin) {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedMovie);
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("you are not allowed");
  }
});

// delete

router.delete("/delete/:id", verify, async (req, res) => {
  if (req.movie.id == req.params.id || req.user.isAdmin) {
    try {
      await Movie.findByIdAndDelete(req.params.id);
      res.status(200).json("Movie has been deleted");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json(req.user);
  }
});

// get

router.get("/find/:id", verify, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.status(200).json(Movie);
  } catch (error) {
    return res.status(500).json(error);
  }
});
// get all

router.get("/allmovies", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
        const movies =  await movie.find();
      res.status(200).json(movies.reverse());
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("you are not allowed");
  }
});

// get random movie
router.get("/random", verify, async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type == series) {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: 1 },
      ]);
      res.status(200).json(movie);
    } else {
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: {size:1} },
      ]);
      res.status(200).json(movie);
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
