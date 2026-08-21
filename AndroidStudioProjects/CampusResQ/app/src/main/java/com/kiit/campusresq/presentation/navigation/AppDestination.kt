package com.kiit.campusresq.presentation.navigation

sealed class AppDestination(val route: String) {

    data object Login : AppDestination("login")

    data object StudentHome : AppDestination("student_home")

    data object MentorHome : AppDestination("mentor_home")
}