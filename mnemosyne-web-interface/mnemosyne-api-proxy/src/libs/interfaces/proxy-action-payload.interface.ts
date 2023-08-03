export interface ProxyActionPayloadInterface {
  controller: string;
  action: string;
  payload?: object;
  method: string;
  params?: object;
  accessToken?: string;
  cookies?: string;
}
