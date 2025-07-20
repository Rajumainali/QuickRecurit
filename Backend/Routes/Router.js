const router = require("express").Router();

const multer = require("multer");
const path = require("path");

// Profile image storage
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/img");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // or use uuid() + path.extname(file.originalname)
  },
});

// Resume file storage
const resumeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/resume");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// logo image storage
const logoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/logos");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // or use uuid() + path.extname(file.originalname)
  },
});

// Certificate file storage
const certificateStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/certificates");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const multiUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === "profile") cb(null, "upload/img");
      else if (file.fieldname === "resume") cb(null, "upload/resume");
      else if (file.fieldname === "logo") cb(null, "upload/logos");
      else if (file.fieldname === "certificate")
        cb(null, "upload/certificates");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

const {
  handleLogin,
  handleSignup,
  CheckDetails,
  AddDetails,
  RecruiterAddDetails,
  PostByRecruiter,
  GetAllPosts,
  ApplyPost,
  updateDetails,
  updateRecruiterDetails,
  getUserDetailsByEmail,
  GetAllPostsByEmail,
  GetAllPostsFront,
  FetchAllPostsByEmail,
  resumeRank,
  applicants,
  updateApplicantStatus,
} = require("../controller/Handler");
const ensureAuthentication = require("../Middleware/Auth");

router.post("/login", handleLogin);

router.post("/signup", handleSignup);
router.get("/check-details", ensureAuthentication, CheckDetails);

router.post(
  "/add-details",
  ensureAuthentication,
  multiUpload.fields([
    { name: "profile", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  AddDetails
);
router.post(
  "/recruiter-add-details",
  ensureAuthentication,
  multiUpload.fields([
    { name: "logo", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
  ]),
  RecruiterAddDetails
);
router.put(
  "/update-details",
  ensureAuthentication,
  multiUpload.fields([
    { name: "profile", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  updateDetails
);
router.put(
  "/update-recruiter-details",
  ensureAuthentication,
  multiUpload.fields([
    { name: "logo", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
  ]),
  updateRecruiterDetails
);

router.post("/create-post", ensureAuthentication, PostByRecruiter);
router.get("/GetAllPosts/:postType", GetAllPosts);
router.get(
  "/GetAllPostsByEmail/:postType",
  ensureAuthentication,
  GetAllPostsByEmail
);
router.get("/apply/:postId", ensureAuthentication, ApplyPost);
router.get("/get-user-Details", ensureAuthentication, getUserDetailsByEmail);
router.get("/fetch-user-Details", ensureAuthentication, FetchAllPostsByEmail);
router.get("/GetAllPosts", GetAllPostsFront);
router.post("/match-resumes", resumeRank);
router.get("/applicants", ensureAuthentication, applicants);
router.put("/update-status/:_id", ensureAuthentication, updateApplicantStatus);

module.exports = router;
