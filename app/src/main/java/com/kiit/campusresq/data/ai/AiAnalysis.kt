package com.kiit.campusresq.data.ai

import org.json.JSONObject

data class AiAnalysis(
    val severity: String = "UNKNOWN",
    val priorityScore: Int = 0,
    val summary: String = "",
    val suggestedAction: String = "",
    val requiresImmediateResponse: Boolean = false
) {
    companion object {
        fun parse(value: Any?): AiAnalysisParseResult {
            if (value == null) {
                return AiAnalysisParseResult()
            }

            val analysis = runCatching {
                when (value) {
                    is String -> fromJsonString(value)
                    is Map<*, *> -> fromMap(value)
                    else -> null
                }
            }.getOrNull()

            return when {
                analysis != null -> AiAnalysisParseResult(analysis = analysis)
                else -> AiAnalysisParseResult(failed = true)
            }
        }

        private fun fromJsonString(raw: String): AiAnalysis? {
            if (raw.isBlank()) {
                return null
            }

            val json = JSONObject(raw)
            return AiAnalysis(
                severity = json.optString("severity", "UNKNOWN"),
                priorityScore = json.optInt("priorityScore", 0),
                summary = json.optString("summary", ""),
                suggestedAction = json.optString("suggestedAction", ""),
                requiresImmediateResponse = json.optBoolean(
                    "requiresImmediateResponse",
                    false
                )
            )
        }

        private fun fromMap(raw: Map<*, *>): AiAnalysis {
            val priorityScoreValue = raw["priorityScore"]
            val priorityScore = when (priorityScoreValue) {
                is Number -> priorityScoreValue.toInt()
                is String -> priorityScoreValue.toIntOrNull() ?: 0
                else -> 0
            }

            val immediateResponseValue = raw["requiresImmediateResponse"]
            val requiresImmediateResponse = when (immediateResponseValue) {
                is Boolean -> immediateResponseValue
                is String -> immediateResponseValue.equals(
                    "true",
                    ignoreCase = true
                )
                else -> false
            }

            return AiAnalysis(
                severity = raw["severity"] as? String ?: "UNKNOWN",
                priorityScore = priorityScore,
                summary = raw["summary"] as? String ?: "",
                suggestedAction = raw["suggestedAction"] as? String ?: "",
                requiresImmediateResponse = requiresImmediateResponse
            )
        }
    }
}

data class AiAnalysisParseResult(
    val analysis: AiAnalysis? = null,
    val failed: Boolean = false
)
