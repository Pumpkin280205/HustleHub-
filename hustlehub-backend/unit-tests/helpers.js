// Minimal Express req/res/next stand-ins so middleware can be tested without a server or database.
const mockRes = () => {
    const res = { statusCode: 200, body: undefined };
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };
    res.json = (body) => {
        res.body = body;
        return res;
    };
    return res;
};

const mockNext = () => {
    const next = (err) => {
        next.called = true;
        next.error = err;
    };
    next.called = false;
    return next;
};

module.exports = { mockRes, mockNext };
