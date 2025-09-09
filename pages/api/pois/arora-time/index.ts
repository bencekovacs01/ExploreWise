import { NextApiRequest, NextApiResponse } from 'next';
import Coordinate from '@/src/models/Coordinate';
import { AroraPTASService } from '@/src/services/AroraPTASService';
import { IPoiData } from '@/src/models/models';
import { measurePerformance } from '@/src/utils/measurePerformance';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const pois: Coordinate[] = req.body?.pois;
    const poiMetadata: IPoiData[] = req.body?.poiMetadata;
    const maxClusterDistance: number = req.body?.maxClusterDistance || 100;

    if (!pois || !poiMetadata) {
      return res.status(400).json({
        error: 'Please provide the pois and poi metadata.',
      });
    }

    const aroraService = new AroraPTASService();

    const { result: route, metrics } = await measurePerformance(
      () => aroraService.findOptimalRoute(pois, poiMetadata, maxClusterDistance),
      'Arora PTAS',
      pois.length,
    );

    res.status(200).json({ route, metrics });
  } catch (error: any) {
    res.status(500).json({
      error: 'An error occurred while processing your request.',
      details: error.message,
    });
  }
}
