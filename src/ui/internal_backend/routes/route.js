/* ----------------- This File Sets Up The Routes Used For Internal Purpose ----------------- */

/* -------------------------------------------------- Requirements -------------------------------------------------- */
const router = require("express-promise-router")();
const SaveController = require("../controllers/SaveData");
const FetchController = require("../controllers/FetchDetails");
/* ------------------------------------------------------------------------------------------------------------------ */


// Get internal leads (postgres)
// 13-7-2022 Sampat
router
	.route("/getinternaleads")
	.get(FetchController.GetInternalLeads);

// Get single internal lead (postgres)
// 13-7-2022 Sampat
router
	.route("/getsingleinternaleads")
	.get(FetchController.GetSingleInternalLead);    

// Save internal leads (postgres)
// 13-7-2022 Sampat
router
	.route("/saveinternaleads")
	.all(SaveController.SaveInternalLeads);    
	
	 
// Get internal doctors (postgres)
// 15-7-2022 Sampat
router
	.route("/getinternaldoctors")
	.get(FetchController.GetInternalDoctors);

		
// Get single internal doctors (postgres)
// 15-7-2022 Sampat
router
	.route("/getsingleinternaldoctor")
	.get(FetchController.GetSingleInternalDoctor);	

	
// Get single internal lead by id (postgres)
// 19-7-2022 Sampat
router
	.route("/getsingleinternalleadbyid")
	.get(FetchController.GetSingleInternalLeadById);
		
//registration follow up whatsapp sendpulse
// 19/07/22 sampat		
router
	.route("/regfollowup")
	.post(SaveController.regFollowUp);

module.exports = router;
