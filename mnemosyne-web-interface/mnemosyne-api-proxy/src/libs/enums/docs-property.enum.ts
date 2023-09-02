export enum DocsProperty {
  METHOD_DESC = 'In order to proxy request from the FE, in the body HTTP method must be specified',
  METHOD_EXAMPLE = 'POST',
  PAYLOAD_DESC = 'For some methods and endpoints, where payload is required, user must provide payload/body of the request.',
  PAYLOAD_EXAMPLE = '{ "email": "joe@doe.com", "password": "12qw!@QW" }',
  PARAMS_DESC = 'Following the same rules, if some endpoints require user to provide params, user must do this via this field and provide the object that is going to be sent to the BE as endpoint params.',
  PARAMS_EXAMPLE = '{ "confirmationHash": "..." }'
}
