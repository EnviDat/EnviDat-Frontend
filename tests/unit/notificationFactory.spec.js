import {
  successMessage,
  errorMessage,
  warningMessage,
  getGenericApiError,
  getSpecificApiError,
} from '../../src/factories/notificationFactory';

describe('notificationFactory - successMessage', () => {
  it('empty', () => {
    const expectedType = 'info';

    const msg = successMessage(undefined, undefined);

    expect(msg).toBeDefined();
    expect(msg.type).toBe(expectedType);
    expect(msg.color).toBe('success');
    expect(msg.message).toBeUndefined();
    expect(msg.details).toBeUndefined();
  });

  it('with Message', () => {
    const msgIn = 'testing success';
    const detailsIn = 'unit test for successMessage()';
    const expectedType = 'info';

    const msg = successMessage(msgIn, detailsIn);

    expect(msg).toBeDefined();
    expect(msg.type).toBe(expectedType);
    expect(msg.color).toBe('success');
    expect(msg.message).toBe(msgIn);
    expect(msg.details).toBe(detailsIn);
  });
});

describe('notificationFactory - errorMessage', () => {
  it('empty', () => {
    const expectedType = 'error';

    const msg = errorMessage(undefined, undefined);

    expect(msg).toBeDefined();
    expect(msg.type).toBe(expectedType);
    expect(msg.color).toBe(expectedType);
    expect(msg.message).toBeUndefined();
    expect(msg.details).toBeUndefined();
  });

  it('with Message', () => {
    const msgIn = 'testing error';
    const expectedType = 'error';
    const detailsIn = 'unit test for errorMessage()';
    const stack = 'infos about the stacktrace';

    const msg = errorMessage(msgIn, detailsIn, stack);

    expect(msg).toBeDefined();
    expect(msg.type).toBe(expectedType);
    expect(msg.color).toBe(expectedType);
    expect(msg.message).toBe(msgIn);
    expect(msg.details).toBe(detailsIn);
    expect(msg.stack).toBe(stack);
  });
});

describe('notificationFactory - warningMessage', () => {
  it('empty', () => {
    const expectedType = 'warning';

    const msg = warningMessage(undefined, undefined);

    expect(msg).toBeDefined();
    expect(msg.type).toBe(expectedType);
    expect(msg.color).toBe(expectedType);
    expect(msg.message).toBeUndefined();
    expect(msg.details).toBeUndefined();
  });

  it('with Message', () => {
    const msgIn = 'testing warning';
    const expectedType = 'warning';
    const detailsIn = 'unit test for warningMessage()';
    const stack = 'infos about the stacktrace';

    const msg = warningMessage(msgIn, detailsIn, stack);

    expect(msg).toBeDefined();
    expect(msg.type).toBe(expectedType);
    expect(msg.color).toBe(expectedType);
    expect(msg.message).toBe(msgIn);
    expect(msg.details).toBe(detailsIn);
    expect(msg.stack).toBe(stack);
  });
});

describe('notificationFactory - getGenericApiError', () => {
  it('empty', () => {
    const expectedType = 'error';

    const msg = getGenericApiError(undefined);

    expect(msg).toBeDefined();
    expect(msg.type).toBe(expectedType);
    expect(msg.color).toBe(expectedType);
    expect(msg.message).toBeUndefined();
    expect(msg.details).toBeUndefined();
  });

  it('with Message 404', () => {
    const expectedType = 'error';
    const reason = {
      response: { status: 404, statusText: 'Not found' },
      request: { responseURL: 'unit test mock url' },
    };

    const msg = getGenericApiError(reason);

    expect(msg).toBeDefined();
    expect(msg.type).toBe(expectedType);
    expect(msg.color).toBe(expectedType);
    expect(msg.message).toBeDefined();
    expect(msg.details).toBeDefined();
    expect(msg.details.includes(reason.response.status)).toBeTruthy();
  });

  it('with Message 401 Not authorized', () => {
    const expectedType = 'error';
    const reason = {
      response: { status: 401 },
      request: { responseURL: 'unit test mock url' },
    };

    const msg = getGenericApiError(reason);

    expect(msg).toBeDefined();
    expect(msg.type).toBe(expectedType);
    expect(msg.color).toBe(expectedType);
    expect(msg.message).toBeDefined();
    expect(msg.details).toBeDefined();
    expect(msg.details.includes(reason.response.status)).toBeTruthy();
  });

  it('with Message 403 Access denied', () => {
    const expectedType = 'error';
    const reason = {
      response: { status: 403 },
      request: { responseURL: 'unit test mock url' },
    };

    const msg = getGenericApiError(reason);

    expect(msg).toBeDefined();
    expect(msg.type).toBe(expectedType);
    expect(msg.color).toBe(expectedType);
    expect(msg.message).toBeDefined();
    expect(msg.details).toBeDefined();
    expect(msg.details.includes(reason.response.status)).toBeTruthy();
  });

  it('with Message 500 Unkonw Server error', () => {
    const expectedType = 'error';
    const reason = {
      response: { status: 500 },
      request: { responseURL: 'unit test mock url' },
    };

    const msg = getGenericApiError(reason);

    expect(msg).toBeDefined();
    expect(msg.type).toBe(expectedType);
    expect(msg.color).toBe(expectedType);
    expect(msg.message).toBeDefined();
    expect(msg.details).toBeDefined();
    expect(msg.details.includes(reason.response.status)).toBeTruthy();
  });
});

describe('notificationFactory - getSpecificApiError', () => {
  it('empty', () => {
    const expectedType = 'error';

    const msg = getSpecificApiError(undefined);

    expect(msg).toBeDefined();
    expect(msg.type).toBe(expectedType);
    expect(msg.color).toBe(expectedType);
    expect(msg.message).toBeUndefined();
    expect(msg.details).toBeUndefined();
  });

  it('with Message 404', () => {
    const expectedType = 'error';
    const details = 'specificError testing';

    const reason = {
      response: {
        status: 404,
        statusText: 'Not found',
      },
      request: { responseURL: 'unit test mock url' },
    };

    const msg = getSpecificApiError(details, reason);

    expect(msg).toBeDefined();
    expect(msg.type).toBe(expectedType);
    expect(msg.color).toBe(expectedType);
    expect(msg.message).toBeDefined();
    expect(msg.message.includes(reason.response.status.toString())).toBeTruthy();
    expect(msg.details.includes(details)).toBeTruthy();
  });
});
