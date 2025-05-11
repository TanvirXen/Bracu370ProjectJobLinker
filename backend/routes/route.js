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

// Middlewares
const { authenticate } = require("../middlewares/authMiddleware");
const { roleCheck } = require("../middlewares/roleMiddleware");

// ───────────────────── AUTH ─────────────────────
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

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

// ───────────────────── JOBS ─────────────────────
router.get("/jobs", jobController.getAllJobs);
router.get("/jobs/:id", jobController.getJobById);
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
router.get("/candidate-skills/:userId", skillController.getCandidateSkills);

// ──────────────────── REVIEWS ───────────────────
router.post("/reviews", authenticate, reviewController.createReview);
router.get("/reviews/:userId", reviewController.getReviewsForUser);

module.exports = router;
