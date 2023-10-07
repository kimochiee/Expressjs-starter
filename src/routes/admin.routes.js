const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  authorizeUser,
} = require("../middlewares/auth.middleware");
const {
  getAllUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

router.use(authenticateUser);
router.use(authorizeUser("admin"));

/**
 * @openapi
 * '/api/v1/admin/users':
 *  get:
 *     tags:
 *     - Admin
 *     summary: Get all users's profile
 *     security:
 *      - Authorization: []
 *     responses:
 *       200:
 *         description: Get all users successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.get("/users", getAllUsers);
/**
 * @openapi
 * '/api/v1/admin/users':
 *  post:
 *     tags:
 *     - Admin
 *     summary: Create new user
 *     security:
 *      - Authorization: []
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
 *                      - role
 *                  properties:
 *                     username:
 *                          type: string
 *                     email:
 *                          type: string
 *                     password:
 *                          type: string
 *                     role:
 *                          type: string
 *     responses:
 *       200:
 *         description: Create user successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post("/users", createUser);
/**
 * @openapi
 * '/api/v1/admin/users/{userId}':
 *  get:
 *     tags:
 *     - Admin
 *     summary: Get one user's profile
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: userId
 *        in: path
 *        description: The id of an user
 *        required: true
 *     responses:
 *       200:
 *         description: Get user successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.get("/users/:userId", getSingleUser);
/**
 * @openapi
 * '/api/v1/admin/users/{userId}':
 *  patch:
 *     tags:
 *     - Admin
 *     summary: Update user's profile
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: userId
 *        in: path
 *        description: The id of an user
 *        required: true
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
 *                      - role
 *                      - address
 *                      - age
 *                      - phone
 *                  properties:
 *                     username:
 *                          type: string
 *                     email:
 *                          type: string
 *                     password:
 *                          type: string
 *                     role:
 *                          type: string
 *                     address:
 *                          type: string
 *                     age:
 *                          type: number
 *                     phone:
 *                          type: string
 *     responses:
 *       200:
 *         description: Update user successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.patch("/users/:userId", updateUser);
/**
 * @openapi
 * '/api/v1/admin/users/{userId}':
 *  delete:
 *     tags:
 *     - Admin
 *     summary: Delete user
 *     security:
 *      - Authorization: []
 *     parameters:
 *      - name: userId
 *        in: path
 *        description: The id of an user
 *        required: true
 *     responses:
 *       200:
 *         description: Delete user successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.delete("/users/:userId", deleteUser);

module.exports = router;
