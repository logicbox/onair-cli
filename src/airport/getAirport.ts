import axios from 'axios';

import { Airport } from '../types/Airport';

const apiUrl = '.onair.company/api/v1/';
const endPoint = 'airports/';

export const getAirport = async (icao: string, apiKey: string, world: string) => {
  return await axios.get(`https://${world}${apiUrl}${endPoint}${icao}`, {
    headers: {
      'oa-apikey': apiKey
    },
  }).then((response: any) => {
    if (typeof response.data.Content !== 'undefined') {
      return response.data.Content as Airport;
    } else {
      throw `Airport ICAO code ${icao.toUpperCase()} not found`;
    };
  }).catch((e) => {
    throw e;
  });
}