const express = require("express");
const { apiKey, permissions } = require("../auth/checkAuth");
const router = express.Router();

// check api key
router.use(apiKey);

// check permission
router.use(permissions("0000"));

router.use("/v1/api", require("./access"));
// router.use("/", (req, res) => {
//   return res.status(200).json({
//     message: "Hello World",
//   });
// });

module.exports = router;
