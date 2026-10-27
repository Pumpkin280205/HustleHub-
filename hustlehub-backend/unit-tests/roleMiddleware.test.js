const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const authorizeRoles = require('../middleware/roleMiddleware');
const { mockRes, mockNext } = require('./helpers');

describe('authorizeRoles', () => {
    test('allows a user whose role is in the allowed list', () => {
        const next = mockNext();

        authorizeRoles('freelancer')({ user: { role: 'freelancer' } }, mockRes(), next);

        assert.equal(next.called, true);
    });

    test('blocks a user whose role is not allowed', () => {
        const res = mockRes();
        const next = mockNext();

        authorizeRoles('freelancer')({ user: { role: 'client' } }, res, next);

        assert.equal(res.statusCode, 403);
        assert.equal(res.body.success, false);
        assert.equal(next.called, false);
    });

    test('blocks a request with no authenticated user', () => {
        const res = mockRes();
        const next = mockNext();

        authorizeRoles('admin')({}, res, next);

        assert.equal(res.statusCode, 403);
        assert.equal(next.called, false);
    });

    test('supports more than one allowed role', () => {
        const middleware = authorizeRoles('client', 'admin');
        const next = mockNext();

        middleware({ user: { role: 'admin' } }, mockRes(), next);

        assert.equal(next.called, true);
    });
});
