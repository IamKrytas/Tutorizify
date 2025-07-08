import { getTotalStatsService } from '../services/statsService.js';

export const getTotalStatsController = async () => {
    return await getTotalStatsService();
}