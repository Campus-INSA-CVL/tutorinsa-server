import app from '../../src/app';

describe('\'years\' service', () => {
  it('registered the service', () => {
    const service = app.service('years');
    expect(service).toBeTruthy();
  });
});
