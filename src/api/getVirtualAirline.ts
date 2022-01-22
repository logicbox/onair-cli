import { VirtualAirline } from '../types/VirtualAirline';
import { config } from '../utils/config';
import onAirRequest, { VirtualAirlineResponse } from './onAirRequest';

const endPoint = 'va/';

export const getVirtualAirline = async (vaId: string, apiKey: string, world: string) => {
  try {
    const response = await onAirRequest<VirtualAirlineResponse>(
      `https://${world}${config.apiUrl}${endPoint}${vaId}`,
      apiKey
    );

    if (typeof response.data.Content !== 'undefined') {
      return response.data.Content as VirtualAirline;
    } else {
      throw new Error(response.data.Error ? response.data.Error : `VA Id "${vaId}"" not found`);
    };
  } catch (e) {
    throw new Error(e.response.status === 400 ? `VA Id "${vaId}" not found` : e.message);
  }
}