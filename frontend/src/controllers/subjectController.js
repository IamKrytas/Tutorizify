import { getAllSubjectsService, getAllLevelsService, addSubjectService, updateSubjectService } from "../services/subjectService";

export const getAllSubjectsController = async () => {
    return await getAllSubjectsService();
}

export const getAllLevelsController = async () => {
    return await getAllLevelsService();
}

export const addSubjectController = async (subjectData) => {
    return await addSubjectService(subjectData);
}

export const updateSubjectController = async (subjectId, subjectData) => {
    return await updateSubjectService(subjectId, subjectData);
}