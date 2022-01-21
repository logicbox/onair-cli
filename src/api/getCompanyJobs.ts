import { Company } from '../types/Company';
import { Job } from '../types/Job';
import { config } from '../utils/config';
import onAirRequest, { JobResponse } from './onAirRequest';


export const getCompanyJobs = async (companyId: string, apiKey: string, world: string) => {
  
  try {
    const response = await onAirRequest<JobResponse>(
      `https://${world}${config.apiUrl}company/${companyId}/jobs/pending`,
      apiKey
    );

    if (typeof response.data.Content !== 'undefined') {
      return response.data.Content as Job[];
    } else {
      throw new Error(response.data.Error ? response.data.Error : `Company Id "${companyId}"" not found`);
    };
  } catch (e) {
    throw new Error(e.response.status === 400 ? `Company Id "${companyId}"" not found` : e.message);
  }
}