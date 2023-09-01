/* ----------------- This File Sets Up The Routes Used For Server Sent Events On Admin ----------------- */
// Created : 9-4-2021 by Prayag
/* -------------------------------------------------- Requirements -------------------------------------------------- */
const router = require("express-promise-router")();
const SaveController = require("../controllers/SaveData");
const FetchController = require("../controllers/FetchDetails");
/* ------------------------------------------------------------------------------------------------------------------ */

router.route("/getuser")
.get(FetchController.GetUser);

module.exports = router;
