package com.kiit.campusresq.presentation.navigation

sealed class AppDestination(val route: String) {

    data object Login : AppDestination("login")

    data object ChooseRole : AppDestination("choose_role")

    data object ReporterHome : AppDestination("reporter_home")

    data object ResponderHome : AppDestination("responder_home")

    data object ReportIncident : AppDestination("report_incident")

    data object MyReports : AppDestination("my_reports")
}
