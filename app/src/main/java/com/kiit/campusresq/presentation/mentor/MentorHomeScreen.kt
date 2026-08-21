package com.kiit.campusresq.presentation.mentor

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel

@Composable
fun MentorHomeScreen(
    viewModel: ResponseTeamViewModel = viewModel()
) {
    val incidents by viewModel.incidents.collectAsState()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        item {
            Text("Response Team")
        }

        items(incidents) { incident ->

            val incidentId = incident["id"].toString()
            val status = incident["status"].toString()

            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp)
                ) {
                    Text(incident["title"].toString())

                    Text("Location: ${incident["location"]}")
                    Text("Status: $status")

                    Text(incident["description"].toString())

                    Row {
                        Button(
                            onClick = {
                                viewModel.updateStatus(
                                    incidentId,
                                    "accepted"
                                )
                            }
                        ) {
                            Text("Accept")
                        }

                        Button(
                            onClick = {
                                viewModel.updateStatus(
                                    incidentId,
                                    "in_progress"
                                )
                            }
                        ) {
                            Text("Start")
                        }

                        Button(
                            onClick = {
                                viewModel.updateStatus(
                                    incidentId,
                                    "resolved"
                                )
                            }
                        ) {
                            Text("Resolve")
                        }
                    }
                }
            }
        }
    }
}
