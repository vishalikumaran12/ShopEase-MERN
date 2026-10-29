
const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// User routes
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);

// Admin routes
router.get("/", protect, adminOnly, getAllOrders);
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;
