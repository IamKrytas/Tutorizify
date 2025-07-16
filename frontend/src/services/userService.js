import { getAddressBackend } from "../utils/getAddressBackend";
import { refreshTokenController } from "../controllers/authController";

export const getUsersService = async () => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend('/api/users/');
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
            return await getUsersService();
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to fetch users");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const getUserInfoService = async () => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend('/api/users/user_info');
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
            return await getUserInfoService();
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to fetch user info");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const getUserProfileService = async (userId) => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend(`/api/users/get_user_profile/${userId}`);
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
            return await getUserProfileService(userId);
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to fetch user profile");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const getRolesService = async () => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend('/api/users/roles');
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
            return await getRolesService();
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to fetch roles");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const updateProfileService = async (profileData) => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend('/api/users/update_profile');
        const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(profileData),
        });

        const data = await response.json();

        if (response.status === 401) {
            await refreshTokenController();
            return await updateProfileService(profileData);
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to update profile");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const updatePasswordService = async (passwordData) => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend('/api/users/update_password');
        const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(passwordData),
        });

        const data = await response.json();

        if (response.status === 401) {
            await refreshTokenController();
            return await updatePasswordService(newPassword);
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to update password");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const updateAvatarService = async (avatar) => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend('/api/users/update_avatar');
        const avatarData = new FormData();
        avatarData.append('avatar', avatar);

        const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: avatarData,
        });

        const data = await response.json();

        if (response.status === 401) {
            await refreshTokenController();
            return await updateAvatarService(userId, avatarData);
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to update avatar");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const updateUserRoleService = async (userId, roleData) => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend(`/api/users/update_role/${userId}`);
        const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(roleData),
        });

        const data = await response.json();

        if (response.status === 401) {
            await refreshTokenController();
            return await updateUserRoleService(userId, newRole);
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to update user role");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const deleteUserService = async () => {
    const token = localStorage.getItem("accessToken");
    try {
        const apiUrl = getAddressBackend('/api/users/delete_user');
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
            return await deleteUserService(userId);
        }

        if (response.status !== 200) {
            throw new Error(data.message || "Failed to delete user");
        }

        return data;
    } catch (error) {
        throw error;
    }
}