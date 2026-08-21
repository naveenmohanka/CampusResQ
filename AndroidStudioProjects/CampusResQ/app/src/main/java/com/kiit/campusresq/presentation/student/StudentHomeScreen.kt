package com.kiit.campusresq.presentation.student

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun StudentHomeScreen(
    onReportIncident: () -> Unit,
    onMyReports: () -> Unit
){
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {

        Text(
            text = "Campus Community"
        )

        Text(
            text = "Help keep your campus safe."
        )

        Spacer(modifier = Modifier.height(20.dp))

        Button(
            onClick = onReportIncident,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Report an Incident")
        }

        Button(
            onClick = onMyReports,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("My Reports")
        }
    }
}
