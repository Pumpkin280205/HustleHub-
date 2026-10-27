const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const errorHandler = require('../middleware/errorMiddleware');
const { mockRes, mockNext } = require('./helpers');

describe('errorHandler', () => {
    const originalConsoleError = console.error;

    // The handler logs the full error server-side; keep test output clean
    beforeEach(() => {
        console.error = () => {};
    });

    afterEach(() => {
        console.error = originalConsoleError;
    });

    test('hides internal details of unexpected errors', () => {
        const res = mockRes();
        const err = new Error('connect ECONNREFUSED 10.0.0.5:27017 at /app/config/db.js');

        errorHandler(err, {}, res, mockNext());

        assert.equal(res.statusCode, 500);
        assert.equal(res.body.message, 'An unexpected error occurred');
        assert.ok(!JSON.stringify(res.body).includes('ECONNREFUSED'));
        assert.equal(res.body.stack, undefined);
    });

    test('returns the public message for known errors', () => {
        const res = mockRes();
        const err = new Error('internal detail');
        err.statusCode = 404;
        err.publicMessage = 'Route not found';

        errorHandler(err, {}, res, mockNext());

        assert.equal(res.statusCode, 404);
        assert.deepEqual(res.body, { success: false, message: 'Route not found' });
    });

    test('falls back to a generic message when no public message is set', () => {
        const res = mockRes();
        const err = new Error('internal detail');
        err.statusCode = 400;

        errorHandler(err, {}, res, mockNext());

        assert.equal(res.body.message, 'Request failed');
    });
});
