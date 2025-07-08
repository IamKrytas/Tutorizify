import { getUsersService, getUserInfoService, getUserProfileService, getRolesService, updateUserProfileService, updateEmailService, updatePasswordService, updateAvatarService, updateUserRoleService, deleteUserService } from '../services/userService.js';

export const getUsersController = async () => {
    return await getUsersService();
}

export const getUserInfoController = async (userId) => {
    return await getUserInfoService(userId);
}

export const getUserProfileController = async (userId) => {
    return await getUserProfileService(userId);
}

export const getRolesController = async () => {
    return await getRolesService();
}

export const updateUserProfileController = async (userId, userData) => {
    return await updateUserProfileService(userId, userData);
}

export const updateEmailController = async (userId, emailData) => {
    return await updateEmailService(userId, emailData);
}

export const updatePasswordController = async (userId, passwordData) => {
    return await updatePasswordService(userId, passwordData);
}

export const updateAvatarController = async (userId, avatarData) => {
    return await updateAvatarService(userId, avatarData);
}

export const updateUserRoleController = async (userId, roleData) => {
    return await updateUserRoleService(userId, roleData);
}

export const deleteUserController = async (userId) => {
    return await deleteUserService(userId);
}