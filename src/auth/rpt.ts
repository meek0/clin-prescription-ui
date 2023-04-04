import { sendRequest } from 'api';
import jwtDecode from 'jwt-decode';

import { keycloakConfig } from 'utils/config';

import { logout } from './keycloak';
import { DecodedRpt, IRptPayload } from './types';

const KEYCLOAK_AUTH_GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:uma-ticket';
export const RPT_TOKEN_URL = `${keycloakConfig.url}realms/clin/protocol/openid-connect/token`;

const rptPayload = new URLSearchParams({
  grant_type: KEYCLOAK_AUTH_GRANT_TYPE,
  audience: keycloakConfig.authClientId,
}).toString();

const decodeRptAccess = (rpt: IRptPayload): DecodedRpt => jwtDecode(rpt.access_token);

const fetchRptToken = async (): Promise<IRptPayload> => {
  const { data, error } = await sendRequest<IRptPayload>({
    method: 'POST',
    url: RPT_TOKEN_URL,
    data: rptPayload,
  });

  if (error) {
    await logout();
  }

  return {
    ...data!,
    decoded: decodeRptAccess(data!),
  };
};

const isTokenExpired = (iat: number, expires_in: number) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = iat + expires_in;
  return currentTime >= expirationTime;
};

export class RptManager {
  private static storedRpt?: IRptPayload;
  private static currentRequestNewRpt?: Promise<IRptPayload>;

  private static async requestNewRpt() {
    if (!this.currentRequestNewRpt) {
      this.currentRequestNewRpt = fetchRptToken();
    }
    return this.currentRequestNewRpt;
  }

  private static async readRptFromStorageOrFetchNew() {
    if (!this.storedRpt || isTokenExpired(this.storedRpt.decoded.iat, this.storedRpt.expires_in)) {
      this.storedRpt = await this.requestNewRpt();
    }
    return this.storedRpt;
  }

  public static async readRpt(): Promise<IRptPayload> {
    const rpt = await this.readRptFromStorageOrFetchNew().finally(
      () => (this.currentRequestNewRpt = undefined),
    );
    return rpt;
  }
}
