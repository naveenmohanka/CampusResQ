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

    data object ReporterSuccess : RoleState

    data object ResponderPending : RoleState

    data object ResponderApproved : RoleState

    data object ResponderRejected : RoleState

    data class Error(
        val message: String
    ) : RoleState
}

class RoleViewModel(
    private val repository: UserRepository =
        UserRepository()
) : ViewModel() {

    private val _roleState =
        MutableStateFlow<RoleState>(RoleState.Idle)

    val roleState =
        _roleState.asStateFlow()

    fun selectReporter() {
        viewModelScope.launch {

            _roleState.value = RoleState.Loading

            repository
                .saveReporterRole()
                .onSuccess {
                    _roleState.value =
                        RoleState.ReporterSuccess
                }
                .onFailure { exception ->
                    _roleState.value =
                        RoleState.Error(
                            exception.message
                                ?: "Failed to save role"
                        )
                }
        }
    }

    fun requestResponderAccess() {
        viewModelScope.launch {

            _roleState.value = RoleState.Loading

            repository
                .requestResponderAccess()
                .onSuccess { status ->

                    _roleState.value =
                        when (status) {

                            "approved" ->
                                RoleState.ResponderApproved

                            "rejected" ->
                                RoleState.ResponderRejected

                            else ->
                                RoleState.ResponderPending
                        }
                }
                .onFailure { exception ->

                    _roleState.value =
                        RoleState.Error(
                            exception.message
                                ?: "Failed to request access"
                        )
                }
        }
    }

    fun checkResponderStatus() {
        viewModelScope.launch {

            _roleState.value = RoleState.Loading

            repository
                .getUserRoleInfo()
                .onSuccess { userInfo ->

                    _roleState.value =
                        when {

                            userInfo.role == "responder" &&
                                    userInfo.responderApprovalStatus == "approved" ->
                                RoleState.ResponderApproved

                            userInfo.responderApprovalStatus == "pending" ->
                                RoleState.ResponderPending

                            userInfo.responderApprovalStatus == "rejected" ->
                                RoleState.ResponderRejected

                            else ->
                                RoleState.Idle
                        }
                }
                .onFailure { exception ->

                    _roleState.value =
                        RoleState.Error(
                            exception.message
                                ?: "Failed to check access status"
                        )
                }
        }
    }
}
