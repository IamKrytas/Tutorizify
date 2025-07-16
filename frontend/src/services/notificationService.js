import { getAddressBackend } from "../utils/getAddressBackend";
import { refreshTokenController } from "../controllers/authController";

export const getNotificationsService = async () => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend("/api/notifications/get_notifications");
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
            return await getNotificationsService();
            
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to fetch notifications");
        }
        
        return data;
    } catch (error) {
        throw error;
    }
}