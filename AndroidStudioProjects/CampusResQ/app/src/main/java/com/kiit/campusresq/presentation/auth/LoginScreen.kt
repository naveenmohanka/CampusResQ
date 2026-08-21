package com.kiit.campusresq.presentation.auth

import androidx.compose.foundation.layout.Column
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable

@Composable
fun LoginScreen(
    onStudentLogin: () -> Unit,
    onMentorLogin: () -> Unit
) {
    Column {
        Text("Login Screen")

        Button(
            onClick = onStudentLogin
        ) {
            Text("Go to Student Home")
        }

        Button(
            onClick = onMentorLogin
        ) {
            Text("Go to Mentor Home")
        }
    }
}