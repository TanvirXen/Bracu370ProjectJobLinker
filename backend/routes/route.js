// routes/index.js

const express = require("express");
const router = express.Router();

// Controllers
const authController = require("../controllers/authController");
const interviewController = require("../controllers/interviewController");
const jobController = require("../controllers/jobController");
const profileController = require("../controllers/profileController");
const reviewController = require("../controllers/reviewController");
const skillController = require("../controllers/skillController");
const appController = require('../controllers/applicationController');
// Middlewares
const { authenticate } = require("../middlewares/authMiddleware");
const { roleCheck } = require("../middlewares/roleMiddleware");

// ───────────────────── AUTH ─────────────────────
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post('/apply/:id', authenticate, appController.createApplication);
router.get('/getapplications', authenticate, appController.getApplications);
// ──────────────────── PROFILE ───────────────────
router.get("/profile", authenticate, profileController.getProfile);
router.put("/profile/update", authenticate, profileController.updateProfile);

// ──────────────────── INTERVIEWS ────────────────
router.post(
  "/interviews",
  authenticate,
  roleCheck("employer"),
  interviewController.createInterview
);
router.put(
  "/interviews/:id",
  authenticate,
  roleCheck("employer"),
  interviewController.updateInterview
);
router.get(
  "/interviews",
  authenticate,
  interviewController.getUserInterviews
);
// ───────────────────── JOBS ─────────────────────
router.get("/jobs/emp", authenticate, jobController.getAllJobsEmployer);
router.get("/jobs", jobController.getAllJobs);
router.get("/jobs/:id", authenticate, jobController.getJobById);
router.get("/jobs/:id/:cid", authenticate, jobController.getJobByIdCid);
router.post(
  "/jobs",
  authenticate,
  roleCheck("employer"),
  jobController.createJob
);
router.post(
  "/jobs/:jobId/skills",
  authenticate,
  roleCheck("employer"),
  jobController.addJobSkills
);
router.post(
  "/jobs/:jobId/apply",
  authenticate,
  roleCheck("candidate"),
  jobController.applyForJob
);

// ──────────────────── SKILLS ────────────────────
router.post("/skills", authenticate, skillController.createSkill);
router.delete("/skills/:id", authenticate, skillController.deleteSkill);
router.get("/skills", skillController.getAllSkills);

// ──────────────── CANDIDATE SKILLS ──────────────
router.post(
  "/candidate-skills",
  authenticate,
  roleCheck("candidate"),
  skillController.addSkillToCandidate
);
router.get("/candidate-skills", authenticate, skillController.getCandidateSkills);
router.delete("/candidate-skills/:skill_id", authenticate, skillController.deleteCandidateSkill);
// ──────────────────── REVIEWS ───────────────────
router.post("/reviews", authenticate, reviewController.createReview);
router.get("/reviews/:userId", reviewController.getReviewsForUser);

module.exports = router;
