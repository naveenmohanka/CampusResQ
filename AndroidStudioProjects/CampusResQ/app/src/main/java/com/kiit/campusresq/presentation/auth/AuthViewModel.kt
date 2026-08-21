package com.kiit.campusresq.presentation.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.kiit.campusresq.data.auth.AuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed interface AuthState {
    data object Idle : AuthState
    data object Loading : AuthState
    data object Success : AuthState

    data class Error(
        val message: String
    ) : AuthState
}

class AuthViewModel(
    private val repository: AuthRepository = AuthRepository()
) : ViewModel() {

    private val _authState = MutableStateFlow<AuthState>(AuthState.Idle)

    val authState = _authState.asStateFlow()

    fun signInWithGoogle(idToken: String) {
        viewModelScope.launch {
            _authState.value = AuthState.Loading

            repository.signInWithGoogle(idToken)
                .onSuccess {
                    _authState.value = AuthState.Success
                }
                .onFailure { exception ->
                    _authState.value = AuthState.Error(
                        exception.message ?: "Sign-in failed"
                    )
                }
        }
    }

    fun isUserLoggedIn(): Boolean {
        return repository.getCurrentUser() != null
    }

    fun signOut() {
        repository.signOut()
        _authState.value = AuthState.Idle
    }
}
