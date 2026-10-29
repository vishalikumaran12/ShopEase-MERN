
const User = require("../models/User");

// GET logged-in user's profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// UPDATE logged-in user's profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (
      (name !== undefined && !name.trim()) ||
      (email !== undefined && !email.trim())
    ) {
      return res.status(400).json({
        message: "Name and email cannot be empty",
      });
    }

    const updates = {};

    if (name !== undefined) updates.name = name.trim();
    if (email !== undefined) updates.email = email.trim().toLowerCase();

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Provide a name or email to update",
      });
    }

    if (updates.email) {
      const existingUser = await User.findOne({
        email: updates.email,
        _id: { $ne: req.user.id },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "Email is already in use",
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};
