import { getNotificationsService } from '../services/notificationService.js';

export const getNotificationsController = async () => {
    return await getNotificationsService();
}