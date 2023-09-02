import { ProxyActionInterface } from '@interfaces/proxy-action.interface';
import { ApiBodyOptions, getSchemaPath } from '@nestjs/swagger';

export abstract class ProxyDocs {
  static get ProxyAction() {
    const ApiModels = [ProxyActionInterface];

    const apiOperationSum =
      'Endpoint is responsible for proxying requests to the BE.';
    const apiOperationDesc =
      'This endpoint is responsible for proxying actions from the FE to the BE. The initial idea of creating such proxy server was initiated by the fact that for the Angular there is no way to send data without exposing credentials of the API. Therefore, in order to hide it and make sure that no one can send requests directly to the API, proxy server was created. The main feature of the proxy server was fact that it adds authorization header (basic auth). In order to send a request from the FE, developer has to pass controller, action (endpoint) and, optionally, body and params. Proxy will check, based on its environmental variables, if it can proxy the action. Basically it means, that by change environmental variables, it is possible to manipulate, what endpoint from the FE can be accessed. According to standards, what needs to be passed via headers, is passed via headers - x-access-token (access token) and cookies (only refresh token).';
    const apiResponseDesc =
      'When in comes to responses, function returns everything that is returned by the BE.';
    const apiBodyDesc =
      'While controller and action is set via params of the proxy endpoint itself, in the body user has to pass HTTP method (HTTP method of the BE endpoint), params of the BE endpoint and payload/body.';

    const accessTokenHeaderDesc =
      'X-Access-Token is an access user token that is passed from the FE to the API proxy and from the API proxy to the BE vie headers.';
    const cookieHeaderDesc =
      'The same as for X-Access-Token, cookies are passed via headers, in this case in cookies only refresh token is passed, but any other cookies will be passed as well.';

    const controllerQueryDesc = 'Controller that implements API endpoint.';
    const actionQueryDesc = 'Action is the endpoint itself.';

    const controllerQuery = {
      description: controllerQueryDesc,
      name: 'controller',
      type: String,
      required: true
    };

    const actionQuery = {
      description: actionQueryDesc,
      name: 'action',
      type: String,
      required: true
    };

    const accessTokenHeader = {
      name: 'X-Access-Token',
      description: accessTokenHeaderDesc,
      required: false
    };

    const cookieHeader = {
      name: 'cookie',
      description: cookieHeaderDesc,
      required: false
    };

    return {
      ApiOperation: {
        summary: apiOperationSum,
        description: apiOperationDesc
      },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc
      },
      ApiBody: {
        type: ProxyActionInterface,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(ProxyActionInterface) }
      } as ApiBodyOptions,
      ApiControllerQuery: controllerQuery,
      ApiActionQuery: actionQuery,
      ApiAccessTokenHeader: accessTokenHeader,
      ApiCookieHeader: cookieHeader
    };
  }
}
