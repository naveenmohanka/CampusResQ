package com.kiit.campusresq.data.incident

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

class IncidentRepository(
    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance(),
    private val auth: FirebaseAuth = FirebaseAuth.getInstance()
) {

    suspend fun submitIncident(
        title: String,
        category: String,
        location: String,
        description: String
    ): Result<Unit> {
        return try {
            val user = auth.currentUser
                ?: return Result.failure(
                    Exception("User not logged in")
                )

            val incidentData = hashMapOf(
                "title" to title,
                "category" to category,
                "location" to location,
                "description" to description,
                "reporterId" to user.uid,
                "reporterName" to (user.displayName ?: ""),
                "status" to "pending",
                "createdAt" to System.currentTimeMillis()
            )

            firestore
                .collection("incidents")
                .add(incidentData)
                .await()

            Result.success(Unit)

        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun getMyReports(): Flow<List<Map<String, Any?>>> = callbackFlow {

        val user = auth.currentUser

        if (user == null) {
            trySend(emptyList())
            close()
            return@callbackFlow
        }

        val listenerRegistration = firestore
            .collection("incidents")
            .whereEqualTo("reporterId", user.uid)
            .addSnapshotListener { snapshot, error ->

                if (error != null) {
                    trySend(emptyList())
                    return@addSnapshotListener
                }

                val reports = snapshot?.documents?.map { document ->
                    mapOf(
                        "id" to document.id,
                        "title" to (
                                document.getString("title") ?: ""
                                ),
                        "category" to (
                                document.getString("category") ?: ""
                                ),
                        "location" to (
                                document.getString("location") ?: ""
                                ),
                        "description" to (
                                document.getString("description") ?: ""
                                ),
                        "status" to (
                                document.getString("status") ?: "pending"
                                ),
                        "createdAt" to (
                                document.getLong("createdAt") ?: 0L
                                )
                    )
                } ?: emptyList()

                trySend(reports)
            }

        awaitClose {
            listenerRegistration.remove()
        }
    }

    fun getAllIncidents(): Flow<List<Map<String, Any?>>> = callbackFlow {

        val listenerRegistration = firestore
            .collection("incidents")
            .addSnapshotListener { snapshot, error ->

                if (error != null) {
                    trySend(emptyList())
                    return@addSnapshotListener
                }

                val incidents = snapshot?.documents?.map { document ->
                    mapOf(
                        "id" to document.id,
                        "title" to (
                                document.getString("title") ?: ""
                                ),
                        "category" to (
                                document.getString("category") ?: ""
                                ),
                        "location" to (
                                document.getString("location") ?: ""
                                ),
                        "description" to (
                                document.getString("description") ?: ""
                                ),
                        "status" to (
                                document.getString("status") ?: "pending"
                                ),
                        "reporterName" to (
                                document.getString("reporterName") ?: ""
                                ),
                        "createdAt" to (
                                document.getLong("createdAt") ?: 0L
                                )
                    )
                } ?: emptyList()

                trySend(incidents)
            }

        awaitClose {
            listenerRegistration.remove()
        }
    }

    suspend fun updateIncidentStatus(
        incidentId: String,
        status: String
    ): Result<Unit> {
        return try {
            firestore
                .collection("incidents")
                .document(incidentId)
                .update("status", status)
                .await()

            Result.success(Unit)

        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
