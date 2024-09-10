import express from "express";
import UserController from "../controller/user.controller.js";
const routerAPI = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management API
 */

/**
 * @swagger
 * /api/v1/user/signup:
 *   post:
 *     description: Create a new user by providing username, email, and password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input data
 */
routerAPI.post("/signup", UserController.postSignupUser);

/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: Log in an existing user
 *     description: Log in using email and password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/src/dto/LoginDTO'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized or invalid credentials
 */
routerAPI.post("/login", UserController.postSigninUser);

export default routerAPI;
