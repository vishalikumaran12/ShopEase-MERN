
const Order = require("../models/Order");
const Product = require("../models/Product");

// @desc    Place a new order
// @route   POST /api/orders
// @access  Logged-in users
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Please add products to your order" });
    }

    if (!shippingAddress || !shippingAddress.trim()) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    // Validate products and calculate prices on the server
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const quantity = Number(item.quantity);

      if (!item.productId || !Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: "Invalid product or quantity" });
      }

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
      });

      totalAmount += product.price * quantity;
    }

    // Reduce stock only after all products have been validated
    for (const item of orderItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      if (!updatedProduct) {
        // Restore stock already deducted for this order
        for (const deducted of orderItems) {
          if (deducted.product.toString() === item.product.toString()) break;

          await Product.updateOne(
            { _id: deducted.product },
            { $inc: { stock: deducted.quantity } }
          );
        }

        return res.status(409).json({
          message: "Stock changed while placing the order. Please try again.",
        });
      }
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress: shippingAddress.trim(),
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to place order",
      error: error.message,
    });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
// @access  Logged-in users
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Admin only
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Admin only
exports.updateOrderStatus = async (req, res) => {
  try {
    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status" });
  }
};
