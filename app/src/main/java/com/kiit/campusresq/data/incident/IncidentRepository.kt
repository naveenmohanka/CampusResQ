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
    ): Result<String> {
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
                "aiAnalysisStatus" to "pending",
                "createdAt" to System.currentTimeMillis()
            )

            val documentReference = firestore
                .collection("incidents")
                .add(incidentData)
                .await()

            Result.success(documentReference.id)

        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun getMyReports(): Flow<List<Incident>> = callbackFlow {

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

                val reports = snapshot?.documents?.map(Incident::fromDocument)
                    ?: emptyList()

                trySend(reports)
            }

        awaitClose {
            listenerRegistration.remove()
        }
    }

    fun getAllIncidents(): Flow<List<Incident>> = callbackFlow {

        val listenerRegistration = firestore
            .collection("incidents")
            .addSnapshotListener { snapshot, error ->

                if (error != null) {
                    trySend(emptyList())
                    return@addSnapshotListener
                }

                val incidents = snapshot?.documents?.map(Incident::fromDocument)
                    ?: emptyList()

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
    suspend fun saveAiAnalysis(
        incidentId: String,
        analysis: String
    ): Result<Unit> {
        return try {
            firestore
                .collection("incidents")
                .document(incidentId)
                .update(
                    mapOf(
                        "aiAnalysis" to analysis,
                        "aiAnalysisStatus" to "completed"
                    )
                )
                .await()

            Result.success(Unit)

        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
