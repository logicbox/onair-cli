import axios from 'axios';

import { Flight } from '../types/Flight';
import { config } from '../utils/config';

const endPoint = 'company/';

export const getCompanyFlights = async (companyId: string, apiKey: string, world: string, page:number=1, limit:number=10) => {
  const startIndex = page > 1 ? limit * page : 0;
  return await axios.get(`https://${world}${config.apiUrl}${endPoint}${companyId}/flights`, {
    params: {
      startIndex: startIndex,
      limit: limit
    },
    headers: {
      'oa-apikey': apiKey,
      'Accept': 'application/json',
      'User-Agent': `CLI for OnAir Company v${config.packageJson.version}`
    },
  }).then((response: any) => {
    if (typeof response.data.Content !== 'undefined') {
      return response.data.Content as Flight[];
    } else {
      throw new Error(response.data.Error ? response.data.Error : `Company Id "${companyId}"" not found`);
    };
  }).catch((e) => {
    throw new Error(e.response.status === 400 ? `Company Id "${companyId}"" not found` : e.message); 
  });
}