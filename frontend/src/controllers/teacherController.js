import { getTeachersService, getAllTeachersService, getAboutByIdService, getMyTeacherProfileService, getMostPopularTeachersService, updateMyTeacherProfileService, updateStatusTeacherByIdService } from '../services/teacherService.js';

export const getTeachersController = async () => {
    return await getTeachersService();
}

export const getAllTeachersController = async () => {
    return await getAllTeachersService();
}

export const getAboutByIdController = async (teacherId) => {
    return await getAboutByIdService(teacherId);
}

export const getMyTeacherProfileController = async () => {
    return await getMyTeacherProfileService();
}

export const getMostPopularTeachersController = async () => {
    return await getMostPopularTeachersService();
}

export const updateMyTeacherProfileController = async (teacherData) => {
    return await updateMyTeacherProfileService(teacherData);
}

export const updateStatusTeacherByIdController = async (teacherId, status) => {
    return await updateStatusTeacherByIdService(teacherId, status);
}