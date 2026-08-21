package com.kiit.campusresq.presentation.incident

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.kiit.campusresq.data.incident.Incident

@Composable
fun AiAnalysisSection(
    incident: Incident,
    modifier: Modifier = Modifier
) {
    val status = incident.aiAnalysisStatus?.lowercase()

    when {
        incident.aiAnalysis != null -> {
            Card(
                modifier = modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = "AI Analysis",
                        style = MaterialTheme.typography.titleMedium
                    )

                    AiAnalysisField("Severity", incident.aiAnalysis.severity)
                    AiAnalysisField(
                        "Priority Score",
                        incident.aiAnalysis.priorityScore.toString()
                    )
                    AiAnalysisField("Summary", incident.aiAnalysis.summary)
                    AiAnalysisField(
                        "Suggested Action",
                        incident.aiAnalysis.suggestedAction
                    )
                    AiAnalysisField(
                        "Immediate Response Required",
                        if (incident.aiAnalysis.requiresImmediateResponse) {
                            "Yes"
                        } else {
                            "No"
                        }
                    )
                }
            }
        }

        status == "pending" || status == "in_progress" || status == "processing" -> {
            Card(
                modifier = modifier.fillMaxWidth()
            ) {
                Text(
                    text = "AI analysis in progress...",
                    modifier = Modifier.padding(16.dp),
                    style = MaterialTheme.typography.bodyMedium
                )
            }
        }

        status == "completed" && incident.aiAnalysisParseFailed -> {
            Card(
                modifier = modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Text(
                        text = "AI Analysis",
                        style = MaterialTheme.typography.titleMedium
                    )
                    Text(
                        text = "AI analysis is available but could not be displayed.",
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            }
        }
    }
}

@Composable
private fun AiAnalysisField(
    label: String,
    value: String
) {
    Column {
        Text(
            text = label,
            style = MaterialTheme.typography.labelMedium
        )
        Spacer(modifier = Modifier.height(2.dp))
        Text(
            text = value.ifBlank { "-" },
            style = MaterialTheme.typography.bodyMedium
        )
    }
}
