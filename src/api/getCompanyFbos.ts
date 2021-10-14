import axios from 'axios';

import { Fbo } from '../types/Fbo';
import { config } from '../utils/config';

const endPoint = 'company/';

export const getCompanyFbos = async (companyId: string, apiKey: string, world: string) => {
  return await axios.get(`https://${world}${config.apiUrl}${endPoint}${companyId}/fbos`, {
    headers: {
      'oa-apikey': apiKey,
      'Accept': 'application/json',
      'User-Agent': `CLI for OnAir Company v${config.packageJson.version}`
    },
  }).then((response: any) => {
    if (typeof response.data.Content !== 'undefined') {
      return response.data.Content as Fbo[];
    } else {
      throw new Error(response.data.Error ? response.data.Error : `Company Id "${companyId}"" not found`);
    };
  }).catch((e) => {
    throw new Error(e.response.status === 400 ? `Company Id "${companyId}"" not found` : e.message); 
  });
}