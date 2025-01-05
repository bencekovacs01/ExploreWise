import { NextApiRequest, NextApiResponse } from 'next';
import Coordinate from '@/src/models/Coordinate';
import { POIService } from '@/src/services/POIService';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const poiService: POIService = new POIService();
        const standardPois = await poiService.getPOICategories();

        res.json(standardPois);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
