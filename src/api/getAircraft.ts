import axios from 'axios';

import { Aircraft } from '../types/Aircraft';
import { config } from '../utils/config';

const endPoint = 'aircraft/';

export const getAircraft = async (aircraftId: string, apiKey: string, world: string) => {
  return await axios.get(`https://${world}${config.apiUrl}${endPoint}${aircraftId}`, {
    headers: {
      'oa-apikey': apiKey,
      'Accept': 'application/json',
      'User-Agent': `CLI for OnAir Company v${config.packageJson.version}`
    },
  }).then((response: any) => {
    if (typeof response.data.Content !== 'undefined') {
      return response.data.Content as Aircraft;
    } else {
      throw new Error(response.data.Error ? response.data.Error : `Aircraft ID code ${aircraftId.toUpperCase()} not found`);
    };
  }).catch((e) => {
    throw new Error(e.message);
  });
}