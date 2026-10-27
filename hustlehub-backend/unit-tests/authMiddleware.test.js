const { test, describe, before } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authMiddleware');
const { mockRes, mockNext } = require('./helpers');

// Random per run, so no secret is ever hardcoded in the repository
const testSecret = crypto.randomBytes(32).toString('hex');
const attackerSecret = crypto.randomBytes(32).toString('hex');

describe('authenticateToken', () => {
    before(() => {
        process.env.JWT_SECRET = testSecret;
    });

    test('rejects a request with no Authorization header', () => {
        const res = mockRes();
        const next = mockNext();

        authenticateToken({ headers: {} }, res, next);

        assert.equal(res.statusCode, 401);
        assert.equal(res.body.message, 'Access token required');
        assert.equal(next.called, false);
    });

    test('rejects a header that is not a Bearer token', () => {
        const res = mockRes();
        const next = mockNext();

        authenticateToken({ headers: { authorization: 'Basic abc123' } }, res, next);

        assert.equal(res.statusCode, 401);
        assert.equal(next.called, false);
    });

    test('rejects a token signed with a different secret', () => {
        const forged = jwt.sign({ id: '1', role: 'admin' }, attackerSecret);
        const res = mockRes();
        const next = mockNext();

        authenticateToken({ headers: { authorization: `Bearer ${forged}` } }, res, next);

        assert.equal(res.statusCode, 401);
        assert.equal(res.body.message, 'Invalid or expired token');
        assert.equal(next.called, false);
    });

    test('rejects an expired token', () => {
        const expired = jwt.sign({ id: '1', role: 'client' }, testSecret, { expiresIn: -10 });
        const res = mockRes();
        const next = mockNext();

        authenticateToken({ headers: { authorization: `Bearer ${expired}` } }, res, next);

        assert.equal(res.statusCode, 401);
        assert.equal(next.called, false);
    });

    test('accepts a valid token and attaches the user to the request', () => {
        const token = jwt.sign({ id: 'abc', role: 'freelancer' }, testSecret, { expiresIn: '1h' });
        const req = { headers: { authorization: `Bearer ${token}` } };
        const next = mockNext();

        authenticateToken(req, mockRes(), next);

        assert.equal(next.called, true);
        assert.equal(req.user.id, 'abc');
        assert.equal(req.user.role, 'freelancer');
    });
});
