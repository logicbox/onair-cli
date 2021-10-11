import axios from 'axios';

import { Company } from '../types/Company';
import { config } from '../utils/config';

const endPoint = 'company/';

export const getCompany = async (companyId: string, apiKey: string, world: string) => {
  return await axios.get(`https://${world}${config.apiUrl}${endPoint}${companyId}`, {
    headers: {
      'oa-apikey': apiKey,
      'Accept': 'application/json',
      'User-Agent': `CLI for OnAir Company v${config.packageJson.version}`
    },
  }).then((response: any) => {
    //console.log(response);
    if (typeof response.data.Content !== 'undefined') {
      return response.data.Content as Company;
    } else {
      throw new Error(response.data.Error ? response.data.Error : `Company Id "${companyId}"" not found`);
    };
  }).catch((e) => {
    throw new Error(e.response.status === 400 ? `Company Id "${companyId}"" not found` : e.message); 
  });
}