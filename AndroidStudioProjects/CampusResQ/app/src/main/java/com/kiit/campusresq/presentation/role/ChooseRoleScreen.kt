package com.kiit.campusresq.presentation.role

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
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
        when (val state = roleState) {
            is RoleState.Success -> {
                when (state.role) {
                    "reporter" -> onReporterSelected()
                    "responder" -> onResponderSelected()
                }
            }
            else -> Unit
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
    ) {
        Text(text = "Select Your Role")

        Spacer(modifier = Modifier.height(32.dp))

        Button(
            onClick = {
                viewModel.selectRole("reporter")
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = roleState !is RoleState.Loading
        ) {
            Column(
                modifier = Modifier.padding(8.dp)
            ) {
                Text(text = "Campus Community")
                Text(text = "Report and track campus incidents")
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = {
                viewModel.selectRole("responder")
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = roleState !is RoleState.Loading
        ) {
            Column(
                modifier = Modifier.padding(8.dp)
            ) {
                Text(text = "Response Team")
                Text(text = "Manage and respond to reported incidents")
            }
        }

        if (roleState is RoleState.Loading) {
            Text(text = "Saving your role...")
        }

        if (roleState is RoleState.Error) {
            Text(
                text = (roleState as RoleState.Error).message
            )
        }
    }
}