import { getAddressBackend } from "../utils/getAddressBackend";
import { refreshTokenController } from "../controllers/authController";

export const getTeachersService = async () => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend("/api/teachers/get_teachers");
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        
        const data = await response.json();

        if (response.status === 401) {
            await refreshTokenController();
            return await getTeachersService();
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to fetch teachers");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const getAllTeachersService = async () => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend("/api/teachers/get_all_teachers");
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.status === 401) {
            await refreshTokenController();
            return await getAllTeachersService();
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to fetch all teachers");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const getAboutByIdService = async (id) => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend(`/api/teachers/get_about/${id}`);
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.status === 401) {
            await refreshTokenController();
            return await getAboutByIdService(id);
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to fetch about information");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const getMyTeacherProfileService = async () => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend('/api/teachers/get_my_teacher_profile');
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.status === 401) {
            await refreshTokenController();
            return await getMyTeacherProfileService();
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to fetch my teacher profile");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const getMostPopularTeachersService = async () => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend("/api/teachers/get_most_popular_teachers");
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.status === 401) {
            await refreshTokenController();
            return await getTotalStatsService();
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to fetch most popular teachers");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const updateMyTeacherProfileService = async (teacherData) => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend('/api/teachers/update_my_teacher_profile');
        const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(teacherData)
        });

        const data = await response.json();

        if (response.status === 401) {
            await refreshTokenController();
            return await updateMyTeacherProfileService(id, data);
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to update teacher profile");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const updateStatusTeacherByIdService = async (id, status) => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend(`/api/teachers/update_status_teacher/${id}`);
        const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });

        const data = await response.json();

        if (response.status === 401) {
            await refreshTokenController();
            return await updateStatusTeacherByIdService(id, status);
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to update teacher status");
        }

        return data;
    } catch (error) {
        throw error;
    }
}