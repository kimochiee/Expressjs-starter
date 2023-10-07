const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  logout,
  renewToken,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");

/**
 * @openapi
 * '/api/v1/auth/signup':
 *  post:
 *     tags:
 *     - Auth
 *     summary: Sign up
 *     requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  required:
 *                      - username
 *                      - email
 *                      - password
 *                      - passwordConfirm
 *                  properties:
 *                     username:
 *                          type: string
 *                     email:
 *                          type: string
 *                     password:
 *                          type: string
 *                     passwordConfirm:
 *                          type: string
 *     responses:
 *       201:
 *         description: Sign up successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post("/signup", signup);
/**
 * @openapi
 * '/api/v1/auth/login':
 *  post:
 *     tags:
 *     - Auth
 *     summary: Log in
 *     requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  required:
 *                      - email
 *                      - password
 *                  properties:
 *                     email:
 *                          type: string
 *                     password:
 *                          type: string
 *     responses:
 *       200:
 *         description: Log in successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post("/login", login);
/**
 * @openapi
 * '/api/v1/auth/logout':
 *  get:
 *     tags:
 *     - Auth
 *     summary: Log out
 *     responses:
 *       200:
 *         description: Log out successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.get("/logout", logout);
/**
 * @openapi
 * '/api/auth/renew_token':
 *  post:
 *     tags:
 *     - Auth
 *     summary: Renew token
 *     responses:
 *       200:
 *         description: Renew access token successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post("/new_token", renewToken);
/**
 * @openapi
 * '/api/v1/auth/forgot_password':
 *  post:
 *     tags:
 *     - Auth
 *     summary: Forgot password
 *     requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  required:
 *                      - email
 *                  properties:
 *                     email:
 *                          type: string
 *     responses:
 *       200:
 *         description: resetPasswordToken sent to email
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post("/forgot_password", forgotPassword);
/**
 * @openapi
 * '/api/v1/auth/reset_password/:resetPasswordToken':
 *  post:
 *     tags:
 *     - Auth
 *     summary: Reset password
 *     requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  required:
 *                      - password
 *                  properties:
 *                     password:
 *                          type: string
 *     responses:
 *       200:
 *         description: Reset password successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post("/reset_password/:resetPasswordToken", resetPassword);

module.exports = router;
