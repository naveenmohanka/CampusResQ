package com.kiit.campusresq.data.user

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.tasks.await

class UserRepository(
    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance(),
    private val auth: FirebaseAuth = FirebaseAuth.getInstance()
) {

    suspend fun getUserRole(): Result<String?> {
        return try {
            val uid = auth.currentUser?.uid
                ?: return Result.failure(
                    Exception("User is not logged in")
                )

            val document = firestore
                .collection("users")
                .document(uid)
                .get()
                .await()

            val role = document.getString("role")

            Result.success(role)

        } catch (exception: Exception) {
            Result.failure(exception)
        }
    }

    suspend fun saveUserRole(role: String): Result<Unit> {
        return try {
            val user = auth.currentUser
                ?: return Result.failure(
                    Exception("User is not logged in")
                )

            val userData = hashMapOf(
                "name" to (user.displayName ?: ""),
                "email" to (user.email ?: ""),
                "role" to role,
                "createdAt" to System.currentTimeMillis()
            )

            firestore
                .collection("users")
                .document(user.uid)
                .set(userData)
                .await()

            Result.success(Unit)

        } catch (exception: Exception) {
            Result.failure(exception)
        }
    }
}
