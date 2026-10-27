const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const {
    validateRegister,
    validateGigCreate,
    validateGigUpdate,
    validateObjectId,
    validateBookingCreate
} = require('../middleware/validationMiddleware');
const { mockRes, mockNext } = require('./helpers');

const run = (middleware, req) => {
    const res = mockRes();
    const next = mockNext();
    middleware(req, res, next);
    return { req, res, next };
};

const validUser = { email: 'user@test.com', password: 'Passw0rd!', role: 'client' };
const validGig = { title: 'Logo design', description: 'A clean, modern logo', category: 'Design', price: 250 };

describe('validateRegister', () => {
    test('accepts a valid registration', () => {
        const { next } = run(validateRegister, { body: { ...validUser } });

        assert.equal(next.called, true);
    });

    test('rejects a weak password', () => {
        const { res, next } = run(validateRegister, { body: { ...validUser, password: 'password' } });

        assert.equal(res.statusCode, 400);
        assert.equal(next.called, false);
        assert.ok(res.body.errors.some(e => e.field === 'password'));
    });

    test('rejects self-registration as admin', () => {
        const { res, next } = run(validateRegister, { body: { ...validUser, role: 'admin' } });

        assert.equal(res.statusCode, 400);
        assert.equal(next.called, false);
    });

    test('reports every invalid field at once', () => {
        const { res } = run(validateRegister, { body: { email: 'not-an-email', password: 'x' } });

        const fields = res.body.errors.map(e => e.field);
        assert.ok(fields.includes('email'));
        assert.ok(fields.includes('password'));
        assert.ok(fields.includes('role'));
    });

    test('rejects a NoSQL operator object in place of the email', () => {
        const { res, next } = run(validateRegister, { body: { ...validUser, email: { $ne: null } } });

        assert.equal(res.statusCode, 400);
        assert.equal(next.called, false);
    });

    test('does not alter the password before hashing', () => {
        const password = 'Pa<ss>w0rd!';
        const { req, next } = run(validateRegister, { body: { ...validUser, password } });

        assert.equal(next.called, true);
        assert.equal(req.body.password, password);
    });

    test('strips fields that are not part of the schema', () => {
        const { req } = run(validateRegister, { body: { ...validUser, isAdmin: true } });

        assert.equal(req.body.isAdmin, undefined);
    });
});

describe('validateGigCreate', () => {
    test('accepts a valid gig', () => {
        const { next } = run(validateGigCreate, { body: { ...validGig } });

        assert.equal(next.called, true);
    });

    test('removes script tags from text fields', () => {
        const { req, next } = run(validateGigCreate, {
            body: { ...validGig, title: 'Logo<script>alert(1)</script> design' }
        });

        assert.equal(next.called, true);
        assert.ok(!req.body.title.includes('<script>'));
        assert.ok(!req.body.title.includes('alert(1)'));
    });

    test('rejects a category outside the allowed list', () => {
        const { res } = run(validateGigCreate, { body: { ...validGig, category: 'Hacking' } });

        assert.equal(res.statusCode, 400);
    });

    test('rejects a price below R1', () => {
        const { res } = run(validateGigCreate, { body: { ...validGig, price: 0 } });

        assert.equal(res.statusCode, 400);
    });
});

describe('validateGigUpdate', () => {
    test('accepts a partial update', () => {
        const { next } = run(validateGigUpdate, { body: { price: 300 } });

        assert.equal(next.called, true);
    });

    test('rejects an empty update', () => {
        const { res } = run(validateGigUpdate, { body: {} });

        assert.equal(res.statusCode, 400);
    });
});

describe('validateObjectId', () => {
    test('accepts a 24-character hex id', () => {
        const { next } = run(validateObjectId, { params: { id: '0123456789abcdef01234567' } });

        assert.equal(next.called, true);
    });

    test('rejects a malformed id', () => {
        const { res, next } = run(validateObjectId, { params: { id: 'abc' } });

        assert.equal(res.statusCode, 400);
        assert.equal(next.called, false);
    });
});

describe('validateBookingCreate', () => {
    test('rejects a gig id that is not a valid ObjectId', () => {
        const { res } = run(validateBookingCreate, { body: { gigId: 'not-an-id' } });

        assert.equal(res.statusCode, 400);
    });
});
