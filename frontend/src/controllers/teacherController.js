import { getTeachersService, getAllTeachersService, getAboutByIdService, getMyTeacherProfileService, updateMyTeacherProfileService, updateStatusTeacherByIdService, deleteTeacherByIdService } from '../services/teacherService.js';

export const getTeachersController = async () => {
    return await getTeachersService();
}

export const getAllTeachersController = async () => {
    return await getAllTeachersService();
}

export const getAboutByIdController = async (teacherId) => {
    return await getAboutByIdService(teacherId);
}

export const getMyTeacherProfileController = async (userId) => {
    return await getMyTeacherProfileService(userId);
}

export const updateMyTeacherProfileController = async (userId, teacherData) => {
    return await updateMyTeacherProfileService(userId, teacherData);
}

export const updateStatusTeacherByIdController = async (teacherId, status) => {
    return await updateStatusTeacherByIdService(teacherId, status);
}

export const deleteTeacherByIdController = async (teacherId) => {
    return await deleteTeacherByIdService(teacherId);
}