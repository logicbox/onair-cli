import axios from 'axios';

import { Aircraft } from '../types/Aircraft';
import { config } from '../utils/config';

const endPoint = 'company/';

export const getCompanyFleet = async (companyId: string, apiKey: string, world: string) => {
  return await axios.get(`https://${world}${config.apiUrl}${endPoint}${companyId}/fleet`, {
    headers: {
      'oa-apikey': apiKey,
      'Accept': 'application/json',
      'User-Agent': `CLI for OnAir Company v${config.packageJson.version}`
    },
  }).then((response: any) => {
    if (typeof response.data.Content !== 'undefined') {
      return response.data.Content as Aircraft[];
    } else {
      throw new Error(response.data.Error ? response.data.Error : `Company Id "${companyId}"" not found`);
    };
  }).catch((e) => {
    throw new Error(e.response.status === 400 ? `Company Id "${companyId}"" not found` : e.message); 
  });
}