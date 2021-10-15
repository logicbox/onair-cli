import axios from 'axios';

import { Aircraft } from '../types/Aircraft';
import { config } from '../utils/config';

const endPoint = 'aircraft/';

export const getAircraft = async (aircraftId: string, apiKey: string, world: string) => {
  if (aircraftId.length!==36) {
    throw new Error('Aircraft ID looks incorrect! It should be a 32 character UUID')
  }
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
      throw new Error(response.data.Error ? response.data.Error : `Aircraft ID code ${aircraftId} not found`);
    };
  }).catch((e) => {
    throw new Error(e.message);
  });
}