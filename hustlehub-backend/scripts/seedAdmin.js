
require('dotenv').config();

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const PASSWORD_RULE =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/;

const seedAdmin = async () => {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first');
    }

    if (!PASSWORD_RULE.test(password)) {
        throw new Error(
            'ADMIN_PASSWORD must be 8-72 characters with uppercase, lowercase, a number and a special character'
        );
    }

    await connectDB();

    const existing = await User.findOne({ email });

    if (existing) {
        console.log(
            existing.role === 'admin'
                ? `Admin ${email} already exists`
                : `${email} is already registered as a ${existing.role}; choose a different ADMIN_EMAIL`
        );
        return;
    }

    await User.create({
        email,
        password: await bcrypt.hash(password, 10),
        role: 'admin'
    });

    console.log(`Admin ${email} created`);
};

seedAdmin()
    .catch((err) => {
        console.error('Admin seed failed:', err.message);
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
