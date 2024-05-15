const router = require("express").Router();
const { Review, User } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", withAuth, async (req, res) => {
  try {
    const reviewData = await Review.findAll({
      include: [{ model: User }],
    });

    const reviews = reviewData.map((project) => project.get({ plain: true }));

    res.render("homepage", {
      reviews,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/review-book/:isbn", withAuth, async (req, res) => {
  try {
    const isbn = req.params.isbn;

    res.render("review", {
      logged_in: true,
      isbn: isbn,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/review/", async (req, res) => {
  try {
    const isbn = req.query.isbn;
    const title = req.query.title;
    const cover_img = req.query.cover;
    const cover_image =
      "http://covers.openlibrary.org/b/id/" + cover_img + "-M.jpg";

    let reviewData = "";
    if (isbn != null && undefined != isbn) {
      reviewData = await Review.findAll({
        include: [{ model: User }],
        where: { isbn: isbn },
      });
    } else {
      reviewData = await Review.findAll({
        include: [{ model: User }],
      });
    }

    if (reviewData != null) {
      const reviews = reviewData.map((project) => project.get({ plain: true }));

      const reviewList = [];
      let reviewObj = [];

      reviews.forEach(function (review) {
        reviewObj = {
          id: review.id,
          review: review.review,
          reviewCreatedBy: review.user.name,
          reviewCreatedAt: review.date_created,
          isbn: isbn,
          title: title,
          coverImg: cover_img
        };
        reviewList.push(reviewObj);
      });
      const reviewIsbn = {
        isbn: isbn,
        title: title,
        coverImgUrl: cover_image,
        coverImg: cover_img,
        reviews: reviewList,
      };

      res.render("review", {
        ...reviewIsbn,
        logged_in: req.session.logged_in,
      });
    } else {
      const reviewIsbn = {
        isbn: isbn,
        title: title,
        cover_img: cover_image,
      };

      res.render("review", {
        ...reviewIsbn,
        logged_in: req.session.logged_in,
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/review");
    return;
  }

  res.render("login");
});

module.exports = router;