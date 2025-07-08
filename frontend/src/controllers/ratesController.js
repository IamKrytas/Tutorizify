import { getAllRatesService, getRatesByIdService, addRateByIdService, deleteRateByIdService } from '../services/ratesService.js';

export const getAllRatesController = async () => {
    return await getAllRatesService();
}

export const getRatesByIdController = async (teacherId) => {
    return await getRatesByIdService(teacherId);
}

export const addRateByIdController = async (teacherId, rateData) => {
    return await addRateByIdService(teacherId, rateData);
}

export const deleteRateByIdController = async (rateId) => {
    return await deleteRateByIdService(rateId);
}