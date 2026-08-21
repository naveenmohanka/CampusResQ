package com.kiit.campusresq.presentation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.rememberNavController
import com.kiit.campusresq.presentation.navigation.AppNavHost

@Composable
fun CampusResQApp() {
    val navController = rememberNavController()

    AppNavHost(
        navController = navController
    )
}
