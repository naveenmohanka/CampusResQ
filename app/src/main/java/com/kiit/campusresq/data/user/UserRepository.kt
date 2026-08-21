package com.kiit.campusresq.data.user

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.tasks.await

data class UserRoleInfo(
    val role: String?,
    val responderApprovalStatus: String?
)

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

    suspend fun getUserRoleInfo(): Result<UserRoleInfo> {
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
                UserRoleInfo(
                    role = document.getString("role"),
                    responderApprovalStatus =
                        document.getString(
                            "responderApprovalStatus"
                        )
                )
            )

        } catch (exception: Exception) {
            Result.failure(exception)
        }
    }

    // Reporter gets direct access
    suspend fun saveReporterRole(): Result<Unit> {
        return try {
            val user = auth.currentUser
                ?: return Result.failure(
                    Exception("User is not logged in")
                )

            val userData = hashMapOf(
                "name" to (user.displayName ?: ""),
                "email" to (user.email ?: ""),
                "role" to "reporter",
                "status" to "active",
                "responderApprovalStatus" to "not_requested",
                "createdAt" to System.currentTimeMillis(),
                "updatedAt" to System.currentTimeMillis()
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

    suspend fun requestResponderAccess(): Result<String> {
        return try {
            val user = auth.currentUser
                ?: return Result.failure(
                    Exception("User is not logged in")
                )

            val userReference = firestore
                .collection("users")
                .document(user.uid)

            val existingUser = userReference
                .get()
                .await()

            val existingApprovalStatus =
                existingUser.getString(
                    "responderApprovalStatus"
                )

            // Already waiting for admin
            if (existingApprovalStatus == "pending") {
                return Result.success("pending")
            }

            // Already approved
            if (
                existingApprovalStatus == "approved" &&
                existingUser.getString("role") == "responder"
            ) {
                return Result.success("approved")
            }

            // Create / update responder request
            val requestData = hashMapOf(
                "name" to (user.displayName ?: ""),
                "email" to (user.email ?: ""),
                "role" to "reporter",
                "status" to "active",
                "responderApprovalStatus" to "pending",
                "responderRequestedAt" to
                        System.currentTimeMillis(),
                "updatedAt" to
                        System.currentTimeMillis()
            )

            // Preserve createdAt for an existing user
            if (!existingUser.exists()) {
                requestData["createdAt"] =
                    System.currentTimeMillis()
            }

            userReference
                .set(
                    requestData,
                    com.google.firebase.firestore.SetOptions.merge()
                )
                .await()

            Result.success("pending")

        } catch (exception: Exception) {
            Result.failure(exception)
        }
    }
}
