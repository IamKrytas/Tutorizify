import { getAddressBackend } from "../utils/getAddressBackend";
import { refreshTokenController } from "../controllers/authController";

export const getAllRatesService = async () => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend('/api/teachers/rates/get_all_rates');
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
            return await getAllRatesService();
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to fetch rates");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const getRatesByIdService = async (teacherId) => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend(`/api/teachers/rates/get_rates/${teacherId}`);
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
            return await getRatesByIdService(teacherId);
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to fetch rates for teacher");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const addRateByIdService = async (teacherId, rateData) => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend(`/api/teachers/rates/add_rate/${teacherId}`);
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(rateData),
        });

        const data = await response.json();


        if (response.status === 401) {
            await refreshTokenController();
            return await addRateByIdService(teacherId, rateData);
        }

        if (response.status !== 201) {
            throw new Error(data.message || "Failed to add rate");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const deleteRateByIdService = async (rateId) => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend(`/api/teachers/rates/delete_rate/${rateId}`);
        const response = await fetch(apiUrl, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.status === 401) {
            await refreshTokenController();
            return await deleteRateByIdService(rateId);
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to delete rate");
        }

        return data;
    } catch (error) {
        throw error;
    }
}