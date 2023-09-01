/* ----------------------------------------------------- Dependencies ----------------------------------------------------- */
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
/* ------------------------------------------------------------------------------------------------------------------ */

// const fs = require('fs')
// const util = require('util')
// const unlinkFile = util.promisify(fs.unlink)
// const { uploadLogo } = require('./src/admin-sales/controllers/SaveData')

// const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })

/* ----------------------------------------------------- Routes ----------------------------------------------------- */
const hospital_search_routes = require("./src/ui/hospital_search/routes/search_by_location");
const preboarding = require("./src/dashboard/hosp_preboarding/routes/preboard_route");
const sseHospitalDashRoute = require("./src/dashboard/hosp_dashboard/routes/sse_routes");
const addPatientRoute = require("./src/dashboard/hospital_addpatient/routes/add_patient_route");
const AdminRoute = require("./src/admin/routes/adminRoute");
const EasyLoanRoute = require("./src/ui/easyloan/routes/route");
const requestsRoute = require("./src/ui/requests/routes/route");
const blogsRoute = require("./src/ui/blogs/routes/route");
const corporateRoute = require("./src/ui/corporate/routes/route");
const SalesAdminRoute = require("./src/admin-sales/routes/route");
const AgentsRoute = require("./src/agents/routes/route");
const HospitalRoute = require("./src/ui/hospitals/routes/route");
const PaymentsRoute = require("./src/payments/route");
const InternalalRoute = require("./src/ui/internal_backend/routes/route");
const FintechRoute = require("./src/fintech/routes/fintechRoute");

/* ------------------------------------------------------------------------------------------------------------------ */

const app = express();
app.use(
  session({
    secret: process.env.EXPRESS_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(expressValidator());
app.use(express.json({ limit: "50mb" }));

//Connecting to MongoDB
mongoose.connect(process.env.MongodbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  //useCreateIndex: true
  //keepAlive: true,
  //keepAliveInitialDelay: 300000,
  //dbName: 'HospitalSchema',
});

const db = mongoose.connection;
mongoose.Promise = global.Promise;
db.once("open", function () {
  console.log("Connected to Database");
});

db.on("error", function (err) {
  if (err) console.log(err);
});

app.use(cors());
app.options("*", cors());

app.use(morgan("dev"));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(passport.initialize());

// Routes
app.use("/easyloan", EasyLoanRoute);
app.use("/hospitals", hospital_search_routes);
app.use("/newhospitals", preboarding);
app.use("/requests", requestsRoute);
app.use("/blogs", blogsRoute);
app.use("/corporate", corporateRoute);
app.use("/hospitaldashboard", sseHospitalDashRoute);
app.use("/hospitaldashboard", addPatientRoute);
app.use("/admin", AdminRoute);
app.use("/salesadmin", SalesAdminRoute);
app.use("/agents", AgentsRoute);
app.use("/hospital", HospitalRoute);
app.use("/payments", PaymentsRoute);
app.use("/internal", InternalalRoute);


//ulpload logo
// app.get('/images/:key', (req, res) => {
// 	console.log(req.params)
// 	const key = req.params.key
// 	const readStream = getFileStream(key)

// 	readStream.pipe(res)
//   })

//   app.post('/images', upload.single('image'), async (req, res) => {
// 	const file = req.file
// 	console.log(file)

// apply filter
// resize

// 	const result = await uploadFile(file)
// 	await unlinkFile(file.path)
// 	console.log(result)
// 	const description = req.body.description
// 	res.send({imagePath: `/images/${result.Key}`})
//   })

// Start the server
const port = process.env.PORT || 8080;
app.listen(port);

console.log(`Server listening at ${port}`);
