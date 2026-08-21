package com.kiit.campusresq.presentation.report

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
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
    private val repository: IncidentRepository = IncidentRepository()
) : ViewModel() {

    private val _reportState =
        MutableStateFlow<ReportState>(ReportState.Idle)

    val reportState = _reportState.asStateFlow()

    fun submitIncident(
        title: String,
        category: String,
        location: String,
        description: String
    ) {
        if (
            title.isBlank() ||
            category.isBlank() ||
            location.isBlank() ||
            description.isBlank()
        ) {
            _reportState.value =
                ReportState.Error("Please fill all fields")
            return
        }

        viewModelScope.launch {
            _reportState.value = ReportState.Loading

            repository
                .submitIncident(
                    title = title,
                    category = category,
                    location = location,
                    description = description
                )
                .onSuccess {
                    _reportState.value = ReportState.Success
                }
                .onFailure { error ->
                    _reportState.value = ReportState.Error(
                        error.message ?: "Failed to submit report"
                    )
                }
        }
    }
}
