package com.kiit.campusresq.presentation.mentor

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.kiit.campusresq.data.incident.Incident
import com.kiit.campusresq.presentation.incident.AiAnalysisSection

private enum class IncidentFilter {
    ALL,
    PENDING,
    ACTIVE,
    RESOLVED
}

@Composable
fun MentorHomeScreen(
    viewModel: ResponseTeamViewModel = viewModel()
) {
    val incidents by viewModel.incidents.collectAsState()

    var selectedFilter by remember {
        mutableStateOf(IncidentFilter.ALL)
    }

    val filteredIncidents = remember(
        incidents,
        selectedFilter
    ) {
        incidents
            .filter { incident ->
                when (selectedFilter) {
                    IncidentFilter.ALL -> true

                    IncidentFilter.PENDING ->
                        incident.status == "pending"

                    IncidentFilter.ACTIVE ->
                        incident.status == "accepted" ||
                                incident.status == "in_progress"

                    IncidentFilter.RESOLVED ->
                        incident.status == "resolved"
                }
            }
            .sortedWith(
                compareBy<Incident> {
                    severityRank(
                        it.aiAnalysis?.severity
                    )
                }.thenBy {
                    it.createdAt
                }
            )
    }

    val criticalCount = incidents.count {
        it.aiAnalysis?.severity == "CRITICAL"
    }

    val highCount = incidents.count {
        it.aiAnalysis?.severity == "HIGH"
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {

        item {
            Text(
                text = "Response Team",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )

            Text(
                text = "Manage and respond to campus incidents",
                style = MaterialTheme.typography.bodyMedium
            )

            Spacer(
                modifier = Modifier.height(16.dp)
            )
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                FilterChip(
                    selected = selectedFilter ==
                            IncidentFilter.ALL,
                    onClick = {
                        selectedFilter =
                            IncidentFilter.ALL
                    },
                    label = {
                        Text("All (${incidents.size})")
                    }
                )

                FilterChip(
                    selected = selectedFilter ==
                            IncidentFilter.PENDING,
                    onClick = {
                        selectedFilter =
                            IncidentFilter.PENDING
                    },
                    label = {
                        Text("Pending")
                    }
                )
            }

            Spacer(
                modifier = Modifier.height(8.dp)
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                FilterChip(
                    selected = selectedFilter ==
                            IncidentFilter.ACTIVE,
                    onClick = {
                        selectedFilter =
                            IncidentFilter.ACTIVE
                    },
                    label = {
                        Text("Active")
                    }
                )

                FilterChip(
                    selected = selectedFilter ==
                            IncidentFilter.RESOLVED,
                    onClick = {
                        selectedFilter =
                            IncidentFilter.RESOLVED
                    },
                    label = {
                        Text("Resolved")
                    }
                )
            }

            Spacer(
                modifier = Modifier.height(20.dp)
            )
        }

        if (
            selectedFilter == IncidentFilter.ALL &&
            (criticalCount > 0 || highCount > 0)
        ) {
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 12.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp)
                    ) {
                        Text(
                            text = "Priority Overview",
                            fontWeight = FontWeight.Bold,
                            style = MaterialTheme
                                .typography
                                .titleMedium
                        )

                        Spacer(
                            modifier = Modifier.height(8.dp)
                        )

                        Text(
                            text =
                                "Critical: $criticalCount  •  " +
                                        "High: $highCount"
                        )
                    }
                }
            }
        }

        item {
            Text(
                text =
                    when (selectedFilter) {
                        IncidentFilter.ALL ->
                            "All Incidents"

                        IncidentFilter.PENDING ->
                            "Pending Incidents"

                        IncidentFilter.ACTIVE ->
                            "Active Incidents"

                        IncidentFilter.RESOLVED ->
                            "Resolved Incidents"
                    },
                style =
                    MaterialTheme
                        .typography
                        .titleMedium,
                fontWeight = FontWeight.Bold
            )

            Spacer(
                modifier = Modifier.height(8.dp)
            )
        }

        if (filteredIncidents.isEmpty()) {
            item {
                Text(
                    text =
                        "No incidents found in this category.",
                    modifier =
                        Modifier.padding(
                            vertical = 32.dp
                        ),
                    style =
                        MaterialTheme
                            .typography
                            .bodyLarge
                )
            }
        }

        items(
            items = filteredIncidents,
            key = { incident -> incident.id }
        ) { incident ->

            IncidentCard(
                incident = incident,
                viewModel = viewModel
            )
        }
    }
}

@Composable
private fun IncidentCard(
    incident: Incident,
    viewModel: ResponseTeamViewModel
) {
    val status = incident.status

    val severity =
        incident.aiAnalysis?.severity
            ?: "ANALYZING"

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        elevation = CardDefaults.cardElevation(
            defaultElevation = 3.dp
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {

            Row(
                modifier =
                    Modifier.fillMaxWidth(),
                horizontalArrangement =
                    Arrangement.SpaceBetween,
                verticalAlignment =
                    Alignment.CenterVertically
            ) {
                Text(
                    text = incident.title,
                    style =
                        MaterialTheme
                            .typography
                            .titleMedium,
                    fontWeight = FontWeight.Bold,
                    modifier =
                        Modifier.weight(1f)
                )

                Spacer(
                    modifier = Modifier.height(1.dp)
                )

                SeverityBadge(
                    severity = severity
                )
            }

            Spacer(
                modifier = Modifier.height(10.dp)
            )

            Row(
                horizontalArrangement =
                    Arrangement.spacedBy(8.dp)
            ) {
                StatusBadge(
                    status = status
                )
            }

            Spacer(
                modifier = Modifier.height(12.dp)
            )

            Text(
                text =
                    "📍 ${incident.location}",
                style =
                    MaterialTheme
                        .typography
                        .bodyMedium
            )

            Spacer(
                modifier = Modifier.height(6.dp)
            )

            Text(
                text =
                    incident.description,
                style =
                    MaterialTheme
                        .typography
                        .bodyMedium
            )

            if (
                incident.aiAnalysis != null ||
                incident.aiAnalysisStatus != null ||
                incident.aiAnalysisParseFailed
            ) {
                Spacer(
                    modifier =
                        Modifier.height(16.dp)
                )

                AiAnalysisSection(
                    incident = incident
                )
            }

            Spacer(
                modifier =
                    Modifier.height(16.dp)
            )

            when (status) {

                "pending" -> {
                    Button(
                        onClick = {
                            viewModel.updateStatus(
                                incident.id,
                                "accepted"
                            )
                        },
                        modifier =
                            Modifier.fillMaxWidth()
                    ) {
                        Text("Accept Incident")
                    }
                }

                "accepted" -> {
                    Button(
                        onClick = {
                            viewModel.updateStatus(
                                incident.id,
                                "in_progress"
                            )
                        },
                        modifier =
                            Modifier.fillMaxWidth()
                    ) {
                        Text("Start Response")
                    }
                }

                "in_progress" -> {
                    Button(
                        onClick = {
                            viewModel.updateStatus(
                                incident.id,
                                "resolved"
                            )
                        },
                        modifier =
                            Modifier.fillMaxWidth()
                    ) {
                        Text("Mark as Resolved")
                    }
                }

                "resolved" -> {
                    Text(
                        text =
                            "✓ Incident Resolved",
                        style =
                            MaterialTheme
                                .typography
                                .bodyLarge,
                        fontWeight =
                            FontWeight.Bold
                    )
                }
            }
        }
    }
}

@Composable
private fun SeverityBadge(
    severity: String
) {
    val backgroundColor =
        when (severity) {
            "CRITICAL" ->
                Color(0xFFFFDAD6)

            "HIGH" ->
                Color(0xFFFFE0B2)

            "MEDIUM" ->
                Color(0xFFFFF3CD)

            "LOW" ->
                Color(0xFFDFF6DD)

            else ->
                Color(0xFFE8E8E8)
        }

    val textColor =
        when (severity) {
            "CRITICAL" ->
                Color(0xFFB3261E)

            "HIGH" ->
                Color(0xFFB85C00)

            "MEDIUM" ->
                Color(0xFF806000)

            "LOW" ->
                Color(0xFF2E7D32)

            else ->
                Color.DarkGray
        }

    Text(
        text = severity,
        color = textColor,
        fontWeight = FontWeight.Bold,
        style = MaterialTheme.typography.labelMedium,
        modifier = Modifier
            .background(
                color = backgroundColor,
                shape = RoundedCornerShape(50)
            )
            .padding(
                horizontal = 10.dp,
                vertical = 5.dp
            )
    )
}

@Composable
private fun StatusBadge(
    status: String
) {
    val displayStatus =
        when (status) {
            "in_progress" ->
                "IN PROGRESS"

            else ->
                status.uppercase()
        }

    Text(
        text = displayStatus,
        style = MaterialTheme.typography.labelMedium,
        fontWeight = FontWeight.SemiBold,
        modifier = Modifier
            .background(
                color = Color(0xFFE8EAF6),
                shape = RoundedCornerShape(50)
            )
            .padding(
                horizontal = 10.dp,
                vertical = 5.dp
            )
    )
}

private fun severityRank(
    severity: String?
): Int {
    return when (severity) {
        "CRITICAL" -> 1
        "HIGH" -> 2
        "MEDIUM" -> 3
        "LOW" -> 4
        else -> 5
    }
}
