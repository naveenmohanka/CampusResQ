package com.kiit.campusresq.data.auth

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.GoogleAuthProvider
import kotlinx.coroutines.tasks.await

class AuthRepository(
    private val auth: FirebaseAuth = FirebaseAuth.getInstance()
) {

    fun getCurrentUser(): FirebaseUser? {
        return auth.currentUser
    }

    suspend fun signInWithGoogle(idToken: String): Result<FirebaseUser> {
        return try {
            val credential = GoogleAuthProvider.getCredential(idToken, null)

            val user = auth
                .signInWithCredential(credential)
                .await()
                .user
                ?: return Result.failure(Exception("Google sign-in failed"))

            Result.success(user)

        } catch (exception: Exception) {
            Result.failure(exception)
        }
    }

    fun signOut() {
        auth.signOut()
    }
}

