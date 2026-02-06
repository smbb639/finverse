import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    standardHeaders: true, 
    legacyHeaders: false, 
    message: {
        status: 429,
        message: "Too many requests, please try again later."
    }
});

export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 10, 
    message: {
        status: 429,
        message: "Too many login attempts, please try again after an hour"
    }
});

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 50,
    message: {
        status: 429,
        message: "Too many API requests, please slow down."
    }
});
