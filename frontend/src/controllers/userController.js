import { getUsersService, getUserInfoService, getUserProfileService, getRolesService, updateProfileService, updatePasswordService, updateAvatarService, updateUserRoleService, deleteUserService } from '../services/userService.js';

export const getUsersController = async () => {
    return await getUsersService();
}

export const getUserInfoController = async () => {
    return await getUserInfoService();
}

export const getUserProfileController = async (userId) => {
    return await getUserProfileService(userId);
}

export const getRolesController = async () => {
    return await getRolesService();
}

export const updateProfileController = async (userData) => {
    return await updateProfileService(userData);
}

export const updatePasswordController = async (passwordData) => {
    return await updatePasswordService(passwordData);
}

export const updateAvatarController = async (avatar) => {
    return await updateAvatarService(avatar);
}

export const updateUserRoleController = async (userId, roleData) => {
    return await updateUserRoleService(userId, roleData);
}

export const deleteUserController = async () => {
    return await deleteUserService();
}