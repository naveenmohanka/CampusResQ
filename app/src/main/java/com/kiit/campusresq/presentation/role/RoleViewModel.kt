package com.kiit.campusresq.presentation.role

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.kiit.campusresq.data.user.UserRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed interface RoleState {
    data object Idle : RoleState
    data object Loading : RoleState

    data class Success(
        val role: String
    ) : RoleState

    data class Error(
        val message: String
    ) : RoleState
}

class RoleViewModel(
    private val repository: UserRepository = UserRepository()
) : ViewModel() {

    private val _roleState = MutableStateFlow<RoleState>(RoleState.Idle)
    val roleState = _roleState.asStateFlow()

    fun selectRole(role: String) {
        viewModelScope.launch {
            _roleState.value = RoleState.Loading

            repository.saveUserRole(role)
                .onSuccess {
                    _roleState.value = RoleState.Success(role)
                }
                .onFailure { exception ->
                    _roleState.value = RoleState.Error(
                        exception.message ?: "Failed to save role"
                    )
                }
        }
    }
}
