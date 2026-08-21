package com.kiit.campusresq.data.ai

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

class AiRepository {

    private val workerUrl =
        "https://misty-paper-18b4.mohankanaveen.workers.dev/"

    suspend fun analyzeIncident(
        title: String,
        category: String,
        location: String,
        description: String
    ): Result<AiAnalysis> = withContext(Dispatchers.IO) {

        try {
            val connection =
                (URL(workerUrl).openConnection() as HttpURLConnection)

            connection.requestMethod = "POST"
            connection.setRequestProperty(
                "Content-Type",
                "application/json"
            )
            connection.doOutput = true
            connection.connectTimeout = 30_000
            connection.readTimeout = 30_000

            val messages = JSONArray()

            messages.put(
                JSONObject().apply {
                    put("role", "system")
                    put(
                        "content",
                        """
                        You are an AI safety analysis assistant for CampusResQ,
                        a campus incident reporting platform.

                        Analyze the incident and respond ONLY with valid JSON.

                        Required format:
                        {
                          "severity": "LOW or MEDIUM or HIGH or CRITICAL",
                          "priorityScore": 1,
                          "summary": "short summary",
                          "suggestedAction": "recommended action",
                          "requiresImmediateResponse": false
                        }
                        """.trimIndent()
                    )
                }
            )

            messages.put(
                JSONObject().apply {
                    put("role", "user")
                    put(
                        "content",
                        """
                        Incident details:

                        Title: $title
                        Category: $category
                        Location: $location
                        Description: $description
                        """.trimIndent()
                    )
                }
            )

            val requestBody = JSONObject().apply {
                put("messages", messages)
            }

            connection.outputStream.use { output ->
                output.write(
                    requestBody
                        .toString()
                        .toByteArray()
                )
            }

            val responseCode = connection.responseCode

            val stream =
                if (responseCode in 200..299) {
                    connection.inputStream
                } else {
                    connection.errorStream
                }

            val responseText =
                stream.bufferedReader().use { it.readText() }

            if (responseCode !in 200..299) {
                return@withContext Result.failure(
                    Exception(responseText)
                )
            }

            val responseJson =
                JSONObject(responseText)

            var aiContent =
                responseJson
                    .getJSONArray("choices")
                    .getJSONObject(0)
                    .getJSONObject("message")
                    .getString("content")

            // Remove ```json and ``` if AI sends markdown code block
            aiContent = aiContent
                .removePrefix("```json")
                .removePrefix("```")
                .removeSuffix("```")
                .trim()

            val aiJson = JSONObject(aiContent)

            val analysis = AiAnalysis(
                severity = aiJson.optString(
                    "severity",
                    "UNKNOWN"
                ),
                priorityScore = aiJson.optInt(
                    "priorityScore",
                    0
                ),
                summary = aiJson.optString(
                    "summary",
                    ""
                ),
                suggestedAction = aiJson.optString(
                    "suggestedAction",
                    ""
                ),
                requiresImmediateResponse = aiJson.optBoolean(
                    "requiresImmediateResponse",
                    false
                )
            )

            Result.success(analysis)

        } catch (exception: Exception) {
            Result.failure(exception)
        }
    }
}
