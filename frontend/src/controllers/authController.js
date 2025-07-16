import { registerUserService, loginUserService, refreshTokenService, registerTeacherService, logoutUserService } from "../services/authService";
import { decodeToken } from "../utils/decodeToken";


export const loginUserController = async (userData) => {
    const data = await loginUserService(userData);
    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;
    const message = data.message;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    decodeToken(accessToken);

    return message
}

export const registerUserController = async (userData) => {
    const data = await registerUserService(userData);
    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;
    const message = data.message;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    decodeToken(accessToken);

    return message
}

export const refreshTokenController = async () => {
    const data = await refreshTokenService();
    const newAccessToken = data.access_token;
    const message = data.message;

    localStorage.setItem("accessToken", newAccessToken);

    return message;
}

export const registerTeacherController = async (teacherData) => {
    const data = await registerTeacherService(teacherData);

    if (!data) {
        throw new Error("Failed to register teacher");
    }
    const newAccessToken = data.access_token;
    const newRefreshToken = data.refresh_token;
    const message = data.message;
    console.log(message)

    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    decodeToken(newAccessToken);

    return message;
}

export const logoutUserController = async () => {
    await logoutUserService()
}