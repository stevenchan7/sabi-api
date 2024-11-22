import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

export const PORT = process.env.PORT || 3000;
export const COOKIE_SESSION_SECRET_KEYS = process.env.COOKIE_SESSION_SECRET_KEYS || 'SECRET_KEY';
export const DB_NAME = process.env.DB_NAME;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_HOST = process.env.DB_HOST;
export const SERVER_HOST = process.env.SERVER_HOST || 'http://localhost/';
