package com.kiit.campusresq.presentation.report

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.kiit.campusresq.data.ai.AiRepository
import com.kiit.campusresq.data.incident.IncidentRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed interface ReportState {
    data object Idle : ReportState
    data object Loading : ReportState
    data object Success : ReportState

    data class Error(
        val message: String
    ) : ReportState
}

class ReportIncidentViewModel(
    private val incidentRepository: IncidentRepository = IncidentRepository(),
    private val aiRepository: AiRepository = AiRepository()
) : ViewModel() {

    private val _reportState = MutableStateFlow<ReportState>(ReportState.Idle)

    val reportState = _reportState.asStateFlow()

    fun submitIncident(
        title: String, category: String, location: String, description: String
    ) {
        if (title.isBlank() || category.isBlank() || location.isBlank() || description.isBlank()) {
            _reportState.value = ReportState.Error("Please fill all fields")
            return
        }

        viewModelScope.launch {
            _reportState.value = ReportState.Loading

            // 1. Save incident to Firestore
            incidentRepository.submitIncident(
                title = title,
                category = category,
                location = location,
                description = description
            ).onSuccess { incidentId ->

                // 2. Analyze with AI
                aiRepository.analyzeIncident(
                    title = title,
                    category = category,
                    location = location,
                    description = description
                ).onSuccess { aiResult ->

                    val analysisJson = """
        {
            "severity": "${aiResult.severity}",
            "priorityScore": ${aiResult.priorityScore},
            "summary": "${aiResult.summary}",
            "suggestedAction": "${aiResult.suggestedAction}",
            "requiresImmediateResponse": ${aiResult.requiresImmediateResponse}
        }
    """.trimIndent()

                    incidentRepository.saveAiAnalysis(
                        incidentId = incidentId, analysis = analysisJson
                    ).onSuccess {
                        _reportState.value = ReportState.Success
                    }.onFailure {
                        // Report is still saved successfully.
                        // AI analysis can be retried later.
                        _reportState.value = ReportState.Success
                    }
                }.onFailure {
                    // Incident report was already saved.
                    // AI failure should not lose the user's report.
                    _reportState.value = ReportState.Success
                }
            }.onFailure { error ->
                _reportState.value = ReportState.Error(
                    error.message ?: "Failed to submit incident"
                )
            }
        }
    }
}
