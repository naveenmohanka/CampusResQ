package com.kiit.campusresq.presentation.mentor

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.kiit.campusresq.data.incident.IncidentRepository
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class ResponseTeamViewModel(
    private val repository: IncidentRepository = IncidentRepository()
) : ViewModel() {

    val incidents = repository
        .getAllIncidents()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    fun updateStatus(
        incidentId: String,
        status: String
    ) {
        viewModelScope.launch {
            repository.updateIncidentStatus(
                incidentId = incidentId,
                status = status
            )
        }
    }
}
