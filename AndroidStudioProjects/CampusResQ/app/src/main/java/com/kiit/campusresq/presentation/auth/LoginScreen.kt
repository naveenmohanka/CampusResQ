package com.kiit.campusresq.presentation.auth

import android.content.Context
import androidx.compose.foundation.layout.Column
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.platform.LocalContext
import androidx.credentials.CredentialManager
import androidx.credentials.GetCredentialRequest
import androidx.credentials.exceptions.GetCredentialException
import androidx.lifecycle.viewmodel.compose.viewModel
import com.google.android.libraries.identity.googleid.GetGoogleIdOption
import kotlinx.coroutines.launch

@Composable
fun LoginScreen(
    onLoginSuccess: () -> Unit,
    viewModel: AuthViewModel = viewModel()
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    val authState by viewModel.authState.collectAsState()

    LaunchedEffect(authState) {
        if (authState is AuthState.Success) {
            onLoginSuccess()
        }
    }

    Column {
        Text("Login Screen")

        Button(
            onClick = {
                coroutineScope.launch {
                    signInWithGoogle(
                        context = context,
                        onTokenReceived = viewModel::signInWithGoogle
                    )
                }
            }
        ) {
            Text(
                when (authState) {
                    AuthState.Loading -> "Signing in..."
                    else -> "Continue with Google"
                }
            )
        }

        if (authState is AuthState.Error) {
            Text(
                text = (authState as AuthState.Error).message
            )
        }
    }
}

private suspend fun signInWithGoogle(
    context: Context,
    onTokenReceived: (String) -> Unit
) {
    try {
        val credentialManager = CredentialManager.create(context)

        val googleIdOption = GetGoogleIdOption.Builder()
            .setServerClientId(
                context.getString(
                    com.kiit.campusresq.R.string.default_web_client_id
                )
            )
            .setFilterByAuthorizedAccounts(false)
            .setAutoSelectEnabled(false)
            .build()

        val request = GetCredentialRequest.Builder()
            .addCredentialOption(googleIdOption)
            .build()

        val result = credentialManager.getCredential(
            request = request,
            context = context
        )

        val credential = result.credential

        if (
            credential.type ==
            com.google.android.libraries.identity.googleid
                .GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL
        ) {
            val googleCredential =
                com.google.android.libraries.identity.googleid
                    .GoogleIdTokenCredential
                    .createFrom(credential.data)

            onTokenReceived(googleCredential.idToken)
        }

    } catch (exception: GetCredentialException) {
        exception.printStackTrace()
    }
}
