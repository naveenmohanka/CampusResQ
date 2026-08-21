const {setGlobalOptions} = require("firebase-functions");
const {
  onCall,
  HttpsError,
} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const logger = require("firebase-functions/logger");

setGlobalOptions({
  maxInstances: 10,
});

// Secrets will be created through Firebase CLI.
// Never put actual API keys in this file.
const nvidiaApiKey = defineSecret("NVIDIA_API_KEY");
const groqApiKey = defineSecret("GROQ_API_KEY");

exports.analyzeIncident = onCall(
  {
    region: "asia-south1",
    timeoutSeconds: 60,
    secrets: [nvidiaApiKey, groqApiKey],
  },
  async (request) => {
    // Security: Firebase Authentication required.
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "You must be logged in to use AI analysis."
      );
    }

    const {
      incidentId,
      title,
      category,
      location,
      description,
    } = request.data;

    // Basic validation.
    if (
      typeof incidentId !== "string" ||
      typeof title !== "string" ||
      typeof category !== "string" ||
      typeof location !== "string" ||
      typeof description !== "string"
    ) {
      throw new HttpsError(
        "invalid-argument",
        "Invalid incident data."
      );
    }

    if (
      title.trim().length === 0 ||
      category.trim().length === 0 ||
      description.trim().length === 0
    ) {
      throw new HttpsError(
        "invalid-argument",
        "Required incident fields cannot be empty."
      );
    }

    // Privacy: only minimum necessary incident data is sent to AI.
    // reporterId, reporterName, email and other personal data are excluded.
    const incidentForAi = {
      title: title.trim(),
      category: category.trim(),
      location: location.trim(),
      description: description.trim(),
    };

    logger.info("Starting AI analysis", {
      incidentId,
      userId: request.auth.uid,
    });

    try {
      // AI provider integration will be added next.
      // NVIDIA is primary, Groq is fallback.
      // Keys are read only from secure Firebase secrets.

      const aiAnalysis = {
        severity: "PENDING",
        priorityScore: 0,
        summary: "AI analysis pending",
        suggestedAction: "",
        requiresImmediateResponse: false,
        providerUsed: "none",
      };

      return {
        success: true,
        incidentId,
        analysis: aiAnalysis,
      };
    } catch (error) {
      logger.error("AI analysis failed", {
        incidentId,
        error: error.message,
      });

      throw new HttpsError(
        "internal",
        "Unable to analyze the incident."
      );
    }
  }
);
