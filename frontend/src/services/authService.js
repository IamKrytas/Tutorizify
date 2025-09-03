import { getAddressBackend } from "../utils/getAddressBackend";

export const loginUserService = async (userData) => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend("/api/auth/login");
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (response.status !== 200) {
            throw new Error(data.message || "Login failed");
        }

        return data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
}

export const registerUserService = async (userData) => {
    try {
        const apiUrl = getAddressBackend("/api/auth/register");
        const response = await fetch(apiUrl, {
            method: "POST",
            body: userData,
        });

        const data = await response.json();

        if (response.status !== 201) {
            throw new Error(data.message || "Registration failed");
        }

        return data;
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
}

export const refreshTokenService = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend("/api/auth/refresh_token");
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        const data = await response.json();

        if (response.status !== 200) {
            logoutUserService();
            window.location.href = "/home";
            return null;
        }

        return data;

    } catch (error) {
        console.error("Token refresh error:", error);
        logoutUserService();
        window.location.href = "/home";
        return null;
    }
}

export const registerTeacherService = async (teacherData) => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend("/api/auth/register_teacher");
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(teacherData),
        });

        const data = await response.json();

        if (response.status !== 201) {
            throw new Error(data.message || "Teacher registration failed");
        }

        if (response.status === 401) {
            await refreshTokenService();
            await registerTeacherService(teacherData);
        }

        return data;

    } catch (error) {
        throw error;
    }
}

export const logoutUserService = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
}
