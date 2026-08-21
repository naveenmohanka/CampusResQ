package com.kiit.campusresq.presentation.report

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.kiit.campusresq.data.incident.IncidentRepository
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.stateIn

class MyReportsViewModel(
    repository: IncidentRepository = IncidentRepository()
) : ViewModel() {

    val reports = repository
        .getMyReports()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )
}
