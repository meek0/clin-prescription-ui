import { Roles, validate } from '../Rules';

describe('is Practitioner', () => {
  test('should be true', () => {
    const roles = [Roles.Practitioner];
    const decodedRpt = {
      authorization: {
        permissions: [
          {
            scopes: ['read'],
            rsname: 'ServiceRequest',
          },
        ],
      },
    };
    expect(validate(roles, decodedRpt, false)).toBe.true;
  });
  test('should be false', () => {
    const roles = [Roles.Practitioner];
    const decodedRpt = {};
    expect(validate(roles, decodedRpt, false)).toBe.false;
  });
});

describe('is Prescriber', () => {
  test('should be true', () => {
    const roles = [Roles.Prescriber];
    const decodedRpt = {
      authorization: {
        permissions: [
          {
            scopes: ['create'],
            rsname: 'ServiceRequest',
          },
        ],
      },
    };
    expect(validate(roles, decodedRpt, false)).toBe.true;
  });
  test('should be false', () => {
    const roles = [Roles.Prescriber];
    const decodedRpt = {};
    expect(validate(roles, decodedRpt, false)).toBe.false;
  });
});

describe('can see Variants', () => {
  test('should be true', () => {
    const roles = [Roles.Variants];
    const decodedRpt = {
      authorization: {
        permissions: [
          {
            rsname: 'Variants',
          },
        ],
      },
    };
    expect(validate(roles, decodedRpt, false)).toBe.true;
  });
  test('should be false', () => {
    const roles = [Roles.Variants];
    const decodedRpt = {};
    expect(validate(roles, decodedRpt, false)).toBe.false;
  });
});

describe('can Download', () => {
  test('should be true', () => {
    const roles = [Roles.Download];
    const decodedRpt = {
      authorization: {
        permissions: [
          {
            rsname: 'download',
          },
        ],
      },
    };
    expect(validate(roles, decodedRpt, false)).toBe.true;
  });
  test('should be false', () => {
    const roles = [Roles.Download];
    const decodedRpt = {};
    expect(validate(roles, decodedRpt, false)).toBe.false;
  });
});

describe('can see Links', () => {
  test('should be true', () => {
    const roles = [Roles.Links];
    const decodedRpt = {
      realm_access: {
        roles: ['clin_adminitrator'],
      },
    };
    expect(validate(roles, decodedRpt, false)).toBe.true;
  });
  test('should be false', () => {
    const roles = [Roles.Links];
    const decodedRpt = {};
    expect(validate(roles, decodedRpt, false)).toBe.false;
  });
});
