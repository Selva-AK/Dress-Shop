import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_NAME = 'auth-token';

if (!JWT_SECRET) {
    throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} - True if match
 */
export async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 * @param {Object} payload - Data to encode in token
 * @returns {Promise<string>} - JWT token
 */
export async function generateToken(payload) {
    const secret = new TextEncoder().encode(JWT_SECRET);
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(secret);
}

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Promise<Object|null>} - Decoded payload or null
 */
export async function verifyToken(token) {
    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (error) {
        return null;
    }
}

/**
 * Set auth cookie
 * @param {string} token - JWT token
 */
export async function setAuthCookie(token) {
    const cookieStore = await cookies();
    cookieStore.set(TOKEN_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });
}

/**
 * Get auth cookie
 * @returns {Promise<string|undefined>} - JWT token or undefined
 */
export async function getAuthCookie() {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_NAME);
    return token?.value;
}

/**
 * Clear auth cookie
 */
export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.set(TOKEN_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
    });
}

/**
 * Get current user from cookie
 * @returns {Promise<Object|null>} - User payload or null
 */
export async function getCurrentUser() {
    try {
        const token = await getAuthCookie();
        if (!token) return null;

        const decoded = await verifyToken(token);

        // Validation: ensure userId is a string
        if (!decoded || typeof decoded.userId !== 'string') {
            return null;
        }

        return decoded;
    } catch (error) {
        console.error('Get user error:', error);
        return null;
    }
}

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>}
 */
export async function isAuthenticated() {
    return (await getCurrentUser()) !== null;
}

/**
 * Check if user is admin
 * @returns {Promise<boolean>}
 */
export async function isAdmin() {
    const user = await getCurrentUser();
    return user?.role === 'admin';
}
