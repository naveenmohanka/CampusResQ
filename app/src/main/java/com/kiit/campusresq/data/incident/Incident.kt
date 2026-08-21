package com.kiit.campusresq.data.incident

import com.google.firebase.firestore.DocumentSnapshot
import com.kiit.campusresq.data.ai.AiAnalysis

data class Incident(
    val id: String = "",
    val title: String = "",
    val category: String = "",
    val location: String = "",
    val description: String = "",
    val status: String = "pending",
    val reporterId: String = "",
    val reporterName: String = "",
    val createdAt: Long = 0L,
    val aiAnalysisStatus: String? = null,
    val aiAnalysisRaw: String? = null,
    val aiAnalysis: AiAnalysis? = null,
    val aiAnalysisParseFailed: Boolean = false
) {
    companion object {
        fun fromDocument(document: DocumentSnapshot): Incident {
            val aiField = document.get("aiAnalysis")
            val parseResult = AiAnalysis.parse(aiField)

            return Incident(
                id = document.id,
                title = document.getString("title").orEmpty(),
                category = document.getString("category").orEmpty(),
                location = document.getString("location").orEmpty(),
                description = document.getString("description").orEmpty(),
                status = document.getString("status") ?: "pending",
                reporterId = document.getString("reporterId").orEmpty(),
                reporterName = document.getString("reporterName").orEmpty(),
                createdAt = document.getLong("createdAt") ?: 0L,
                aiAnalysisStatus = document.getString("aiAnalysisStatus"),
                aiAnalysisRaw = aiField as? String,
                aiAnalysis = parseResult.analysis,
                aiAnalysisParseFailed = parseResult.failed
            )
        }
    }
}
