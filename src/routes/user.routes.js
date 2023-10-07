const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middlewares/auth.middleware");
const uploadCloud = require("../config/cloudinary");
const {
  getCurrentUser,
  updateMe,
  uploadAvatar,
  updateMyPassword,
} = require("../controllers/user.controller");

router.use(authenticateUser);

/**
 * @openapi
 * '/api/v1/user/current_user':
 *  get:
 *     tags:
 *     - User
 *     summary: Get your profile's information
 *     security:
 *      - Authorization: []
 *     responses:
 *       200:
 *         description: Get your profile's information successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.get("/current_user", getCurrentUser);
/**
 * @openapi
 * '/api/v1/user/update_me':
 *  patch:
 *     tags:
 *     - User
 *     summary: update your profile's information
 *     security:
 *      - Authorization: []
 *     requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  required:
 *                      - address
 *                      - age
 *                      - phone
 *                  properties:
 *                     address:
 *                          type: string
 *                     age:
 *                          type: number
 *                     phone:
 *                          type: string
 *     responses:
 *       200:
 *         description: Update your profile successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.patch("/update_me", updateMe);
/**
 * @openapi
 * '/api/user/upload_avatar':
 *  post:
 *     tags:
 *     - User
 *     summary: Upload user's avatar
 *     security:
 *      - Authorization: []
 *     requestBody:
 *      content:
 *       multipart/form-data:
 *          schema:
 *              type: object
 *              properties:
 *                  avatar:
 *                      type: string
 *                      format: binary
 *                      nullable: false
 *     responses:
 *      200:
 *        description: Upload avatar successfully
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Server error
 */
router.patch("/upload_avatar", uploadCloud.single("image"), uploadAvatar);
/**
 * @openapi
 * '/api/v1/user/update_my_password':
 *  patch:
 *     tags:
 *     - User
 *     summary: Update your password
 *     security:
 *      - Authorization: []
 *     requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  required:
 *                      - currentPassword
 *                      - password
 *                      - passwordConfirm
 *                  properties:
 *                     currentPassword:
 *                          type: string
 *                     password:
 *                          type: string
 *                     passwordConfirm:
 *                          type: string
 *     responses:
 *       200:
 *         description: Update your password successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.patch("/update_my_password", updateMyPassword);

module.exports = router;
