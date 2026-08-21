package com.kiit.campusresq.presentation.role

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel

@Composable
fun ChooseRoleScreen(
    onReporterSelected: () -> Unit,
    onResponderSelected: () -> Unit,
    viewModel: RoleViewModel = viewModel()
) {
    val roleState by viewModel.roleState.collectAsState()

    LaunchedEffect(roleState) {
        when (roleState) {

            is RoleState.ReporterSuccess -> {
                onReporterSelected()
            }

            is RoleState.ResponderApproved -> {
                onResponderSelected()
            }

            is RoleState.ResponderPending -> {
                // User is waiting for admin approval
            }

            else -> Unit
        }
    }

    val isLoading = roleState is RoleState.Loading

    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier.fillMaxWidth()
        ) {

            Text(
                text = "Choose your role",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )

            Spacer(
                modifier = Modifier.height(8.dp)
            )

            Text(
                text = "Select how you want to use CampusResQ.",
                style = MaterialTheme.typography.bodyLarge
            )

            Spacer(
                modifier = Modifier.height(36.dp)
            )

            RoleCard(
                title = "Campus Community",
                description =
                    "Report safety incidents and track their response status.",
                action = "Continue as Reporter",
                enabled = !isLoading,
                onClick = {
                    viewModel.selectReporter()
                }
            )

            Spacer(
                modifier = Modifier.height(16.dp)
            )

            RoleCard(
                title = "Response Team",
                description =
                    "Review reported incidents and coordinate their response.",
                action = "Continue as Responder",
                enabled = !isLoading,
                onClick = {
                    viewModel.requestResponderAccess()
                }
            )

            if (isLoading) {

                Spacer(
                    modifier = Modifier.height(28.dp)
                )

                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    CircularProgressIndicator()

                    Spacer(
                        modifier = Modifier.height(12.dp)
                    )

                    Text(
                        text = "Saving your role..."
                    )
                }
            }

            if (roleState is RoleState.Error) {

                Spacer(
                    modifier = Modifier.height(20.dp)
                )

                Text(
                    text =
                        (roleState as RoleState.Error).message,
                    color =
                        MaterialTheme
                            .colorScheme
                            .error,
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            color =
                                MaterialTheme
                                    .colorScheme
                                    .errorContainer,
                            shape =
                                RoundedCornerShape(12.dp)
                        )
                        .padding(12.dp)
                )
            }
        }
    }
}

@Composable
private fun RoleCard(
    title: String,
    description: String,
    action: String,
    enabled: Boolean,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(
                enabled = enabled,
                onClick = onClick
            ),
        shape = RoundedCornerShape(20.dp),
        elevation = CardDefaults.cardElevation(
            defaultElevation = 3.dp
        )
    ) {
        Column(
            modifier = Modifier.padding(22.dp)
        ) {

            Text(
                text = title,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )

            Spacer(
                modifier = Modifier.height(10.dp)
            )

            Text(
                text = description,
                style = MaterialTheme.typography.bodyMedium
            )

            Spacer(
                modifier = Modifier.height(20.dp)
            )

            Text(
                text = action,
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.primary,
                fontWeight = FontWeight.SemiBold
            )
        }
    }
}
