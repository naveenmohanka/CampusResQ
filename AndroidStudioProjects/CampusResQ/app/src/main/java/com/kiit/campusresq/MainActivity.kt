package com.kiit.campusresq

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.kiit.campusresq.presentation.CampusResQApp
import com.kiit.campusresq.ui.theme.CampusResQTheme

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        enableEdgeToEdge()

        setContent {
            CampusResQTheme {
                CampusResQApp()
            }
        }
    }
}
