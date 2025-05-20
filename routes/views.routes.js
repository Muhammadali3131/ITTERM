const { createViewPage } = require("../helpers/create_view_page");
const Author = require("../schemas/Author");
const Dictionary = require("../schemas/Dictionary");
const Topic = require("../schemas/Topic");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.render(createViewPage("index"), {
    title: "Asosiy sahifa",
    isHome: true,
  });
});

router.get("/dictionary", async (req, res) => {
  let dictionary = await Dictionary.find().lean();

  res.render(createViewPage("dictionary"), {
    title: "Lug'atlar",
    isDict: true,
    dictionary,
  });
});

router.get("/authors", async (req, res) => {
  let authors = await Author.find().lean();

  res.render(createViewPage("authors"), {
    title: "Mualliflar",
    isAuthor: true,
    authors,
  });
});

router.get("/topics", async (req, res) => {
  let topics = await Topic.find().lean();

  res.render(createViewPage("topics"), {
    title: "Maqolalar",
    isTopic: true,
    topics,
  });
});

router.get("/login", (req, res) => {
  res.render(createViewPage("login"), {
    title: "Tizimga kirish",
    isLogin: true,
  });
});

module.exports = router;
