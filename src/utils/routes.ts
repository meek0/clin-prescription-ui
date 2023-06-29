export enum STATIC_ROUTES {
  HOME = '/',
  ERROR = '/error',
  LANDING = '/landing',
}

export enum DYNAMIC_ROUTES {
  ERROR = '/error/:status?',
  PRESCRIPTION_ENTITY = '/prescription/entity/:id',
}
