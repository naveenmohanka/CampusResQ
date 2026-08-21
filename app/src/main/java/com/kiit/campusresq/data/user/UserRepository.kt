package com.kiit.campusresq.data.user

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.tasks.await

class UserRepository(
    private val firestore: FirebaseFirestore =
        FirebaseFirestore.getInstance(),

    private val auth: FirebaseAuth =
        FirebaseAuth.getInstance()
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

            Result.success(
                document.getString("role")
            )

        } catch (exception: Exception) {
            Result.failure(exception)
        }
    }

    // Reporter gets direct access
    suspend fun saveUserRole(
        role: String
    ): Result<Unit> {
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

    // Creates request only if one does not already exist
    suspend fun requestResponderAccess(): Result<String> {
        return try {
            val user = auth.currentUser
                ?: return Result.failure(
                    Exception("User is not logged in")
                )

            val requestReference = firestore
                .collection("responder_requests")
                .document(user.uid)

            val existingRequest = requestReference
                .get()
                .await()

            if (existingRequest.exists()) {

                val status =
                    existingRequest.getString("status")
                        ?: "pending"

                return Result.success(status)
            }

            val requestData = hashMapOf(
                "uid" to user.uid,
                "name" to (user.displayName ?: ""),
                "email" to (user.email ?: ""),
                "status" to "pending",
                "requestedAt" to
                        System.currentTimeMillis()
            )

            requestReference
                .set(requestData)
                .await()

            Result.success("pending")

        } catch (exception: Exception) {
            Result.failure(exception)
        }
    }
}
