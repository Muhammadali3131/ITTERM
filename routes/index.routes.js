const router = require("express").Router();

const authorRouter = require("./author.routes");
const adminRouter = require("./admin.routes");
const dictRouter = require("./dictionary.routes");
const categoryRouter = require("./category.routes");
const descriptionRouter = require("./description.routes");
const synonymRouter = require("./synonym.routes");
const socialRouter = require("./social.routes");
const topicRouter = require("./topic.routes");
const descRouter = require("./desc_topic.routes");
const tagRouter = require("./tag.routes");
const userRouter = require("./user.routes");

router.use("/author", authorRouter);
router.use("/admin", adminRouter);
router.use("/dict", dictRouter);
router.use("/category", categoryRouter);
router.use("/description", descriptionRouter);
router.use("/synonym", synonymRouter);
router.use("/social", socialRouter);
router.use("/topic", topicRouter);
router.use("/desc", descRouter);
router.use("/tag", tagRouter);
router.use("/user", userRouter);

module.exports = router;
