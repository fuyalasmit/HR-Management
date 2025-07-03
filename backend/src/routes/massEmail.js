const massEmailController = require("../controllers/massEmail");
const { requireAuth } = require("../../config/authJwt");

module.exports = (router) => {
  // POST /api/mass-email/send - Send mass email
  router.route("/mass-email/send").post(requireAuth, massEmailController.sendMassEmail);

  // GET /api/mass-email/history - Fetch email history
  router.route("/mass-email/history").get(requireAuth, massEmailController.fetchEmailHistory);

  // GET /api/mass-email/:id - Fetch specific email details
  router.route("/mass-email/:id").get(requireAuth, massEmailController.fetchEmailDetails);
};
