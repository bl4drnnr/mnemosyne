export abstract class ProxyDocs {
  static get ProxyAction() {
    const ApiModels = [];

    const apiOperationSum = '';
    const apiResponseDesc = '';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc
      }
    };
  }
}
