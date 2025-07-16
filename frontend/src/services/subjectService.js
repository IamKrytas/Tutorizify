import { getAddressBackend } from "../utils/getAddressBackend";
import { refreshTokenController } from "../controllers/authController";

export const getAllSubjectsService = async () => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend('/api/subjects/get_all_subjects');
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.status === 401) {
            await refreshTokenController();
            return await getAllSubjectsService();
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to fetch subjects");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const getAllLevelsService = async () => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend('/api/subjects/get_all_levels');
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.status === 401) {
            await refreshTokenController();
            return await getAllLevelsService();
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to fetch levels");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const addSubjectService = async (subjectData) => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend('/api/subjects/add_subject');
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(subjectData),
        });

        const data = await response.json();

        if (response.status === 401) {
            await refreshTokenController();
            return await addSubjectService(subjectData);
        }

        if (response.status !== 201) {
            throw new Error(data.message || "Failed to add subject");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const updateSubjectService = async (subjectId, subjectData) => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend(`/api/subjects/update_subject/${subjectId}`);
        const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(subjectData),
        });

        const data = await response.json();

        if (response.status === 401) {
            await refreshTokenController();
            return await updateSubjectService(subjectId, subjectData);
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to update subject");
        }

        return data;
    } catch (error) {
        throw error;
    }
}
