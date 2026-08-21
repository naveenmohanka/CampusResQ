package com.kiit.campusresq.presentation.report

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.compose.material3.ExperimentalMaterial3Api


@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReportIncidentScreen(
    onSubmit: () -> Unit,
    viewModel: ReportIncidentViewModel = viewModel()
) {
    var title by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var location by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("") }
    var categoryExpanded by remember { mutableStateOf(false) }

    val reportState by viewModel.reportState.collectAsState()

    val categories = listOf(
        "Medical Emergency",
        "Fire Hazard",
        "Harassment",
        "Unsafe Area",
        "Infrastructure Failure",
        "Other"
    )

    LaunchedEffect(reportState) {
        if (reportState is ReportState.Success) {
            onSubmit()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text("Report an Incident")

        ExposedDropdownMenuBox(
            expanded = categoryExpanded,
            onExpandedChange = {
                categoryExpanded = !categoryExpanded
            }
        ) {
            OutlinedTextField(
                value = selectedCategory,
                onValueChange = {},
                readOnly = true,
                label = {
                    Text("Incident Category")
                },
                trailingIcon = {
                    ExposedDropdownMenuDefaults.TrailingIcon(
                        expanded = categoryExpanded
                    )
                },
                modifier = Modifier
                    .menuAnchor()
                    .fillMaxWidth()
            )

            ExposedDropdownMenu(
                expanded = categoryExpanded,
                onDismissRequest = {
                    categoryExpanded = false
                }
            ) {
                categories.forEach { category ->
                    DropdownMenuItem(
                        text = {
                            Text(category)
                        },
                        onClick = {
                            selectedCategory = category
                            categoryExpanded = false
                        }
                    )
                }
            }
        }

        OutlinedTextField(
            value = title,
            onValueChange = {
                title = it
            },
            label = {
                Text("Incident Title")
            },
            modifier = Modifier.fillMaxWidth()
        )

        OutlinedTextField(
            value = location,
            onValueChange = {
                location = it
            },
            label = {
                Text("Location")
            },
            modifier = Modifier.fillMaxWidth()
        )

        OutlinedTextField(
            value = description,
            onValueChange = {
                description = it
            },
            label = {
                Text("Describe the incident")
            },
            modifier = Modifier.fillMaxWidth(),
            minLines = 4
        )

        Button(
            onClick = {
                viewModel.submitIncident(
                    title = title,
                    category = selectedCategory,
                    location = location,
                    description = description
                )
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = reportState !is ReportState.Loading
        ) {
            Text("Submit Report")
        }

        if (reportState is ReportState.Loading) {
            CircularProgressIndicator()
        }

        if (reportState is ReportState.Error) {
            Text(
                text = (reportState as ReportState.Error).message
            )
        }
    }
}
