import { registerUserService, loginUserService, refreshTokenService, registerTeacherService, logoutUserService } from "../services/authService";

export const loginUserController = async (userData) => {
    return await loginUserService(userData)
}

export const registerUserController = async (userData) => {
    return await registerUserService(userData)
}

export const refreshTokenController = async (token) => {
    return await refreshTokenService(token)
}

export const registerTeacherController = async (userData) => {
    return await registerTeacherService(userData)
}

export const logoutUserController = async () => {
    return await logoutUserService()
}