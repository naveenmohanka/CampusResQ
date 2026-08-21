package com.kiit.campusresq.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.kiit.campusresq.presentation.auth.LoginScreen
import com.kiit.campusresq.presentation.role.ChooseRoleScreen
import com.kiit.campusresq.presentation.mentor.MentorHomeScreen
import com.kiit.campusresq.presentation.report.MyReportsScreen
import com.kiit.campusresq.presentation.report.ReportIncidentScreen
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

        // Login
        composable(AppDestination.Login.route) {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate(
                        AppDestination.ChooseRole.route
                    )
                }
            )
        }

      // ReportIncident
        composable(AppDestination.ReportIncident.route) {
            ReportIncidentScreen(
                onSubmit = {
                    navController.popBackStack()
                }
            )
        }
        // First-time role selection
        composable(AppDestination.ChooseRole.route) {
            ChooseRoleScreen(
                onReporterSelected = {
                    navController.navigate(
                        AppDestination.ReporterHome.route
                    )
                },
                onResponderSelected = {
                    navController.navigate(
                        AppDestination.ResponderHome.route
                    )
                }
            )
        }

        // Reporter / Campus Community
        composable(AppDestination.ReporterHome.route) {
            StudentHomeScreen(
                onReportIncident = {
                    navController.navigate(
                        AppDestination.ReportIncident.route
                    )
                },
                onMyReports = {
                    navController.navigate(
                        AppDestination.MyReports.route
                    )
                }
            )
        }

        composable(AppDestination.MyReports.route) {
            MyReportsScreen()
        }

        // Responder / Response Team
        composable(AppDestination.ResponderHome.route) {
            MentorHomeScreen()
        }
    }
}
