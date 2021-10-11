import axios from 'axios';

import { Airport } from '../types/Airport';
import { config } from '../utils/config';

const endPoint = 'airports/';

export const getAirport = async (icao: string, apiKey: string, world: string) => {
  return await axios.get(`https://${world}${config.apiUrl}${endPoint}${icao}`, {
    headers: {
      'oa-apikey': apiKey,
      'Accept': 'application/json',
      'User-Agent': `CLI for OnAir Company v${config.packageJson.version}`
    },
  }).then((response: any) => {
    if (typeof response.data.Content !== 'undefined') {
      return response.data.Content as Airport;
    } else {
      throw new Error(response.data.Error ? response.data.Error : `Airport ICAO code ${icao.toUpperCase()} not found`);
    };
  }).catch((e) => {
    throw new Error(e.message);
  });
}