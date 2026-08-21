package com.kiit.campusresq.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.kiit.campusresq.presentation.auth.LoginScreen
import com.kiit.campusresq.presentation.mentor.MentorHomeScreen
import com.kiit.campusresq.presentation.student.StudentHomeScreen

@Composable
fun AppNavHost(
    navController: NavHostController,
    modifier: Modifier = Modifier
) {
    NavHost(
        navController = navController,
        startDestination = AppDestination.Login.route,
        modifier = modifier
    ) {

        composable(AppDestination.Login.route) {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate(
                        AppDestination.StudentHome.route
                    )
                }
            )
        }

        composable(AppDestination.StudentHome.route) {
            StudentHomeScreen()
        }

        composable(AppDestination.MentorHome.route) {
            MentorHomeScreen()
        }
    }
}
