import { getAddressBackend } from "../utils/getAddressBackend";
import { refreshTokenController } from "../controllers/authController";

export const getTotalStatsService = async () => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend("/api/stats/get_total_stats");
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
            return await getTotalStatsService();
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to fetch stats");
        }

        return data;
    } catch (error) {
        throw error;
    }
}