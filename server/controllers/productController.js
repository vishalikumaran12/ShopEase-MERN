const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    let query = Product.find(filter);

    if (sort === "price-low") query = query.sort({ price: 1 });
    if (sort === "price-high") query = query.sort({ price: -1 });
    if (sort === "newest") query = query.sort({ createdAt: -1 });

    const products = await query;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch {
    res.status(400).json({ message: "Invalid product ID" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    if (
      typeof name !== "string" || !name.trim() ||
      typeof description !== "string" || !description.trim() ||
      typeof category !== "string" || !category.trim() ||
      !Number.isFinite(price) || price < 0 ||
      (stock !== undefined && (!Number.isInteger(stock) || stock < 0))
    ) {
      return res.status(400).json({ message: "Invalid product details" });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price,
      category: category.trim(),
      image: typeof image === "string" ? image : "",
      stock: stock ?? 0,
    });

    res.status(201).json(product);
  } catch {
    res.status(500).json({ message: "Failed to create product" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const allowed = ["name", "description", "price", "category", "image", "stock"];
    const updates = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (
      ("name" in updates && (typeof updates.name !== "string" || !updates.name.trim())) ||
      ("description" in updates && (typeof updates.description !== "string" || !updates.description.trim())) ||
      ("category" in updates && (typeof updates.category !== "string" || !updates.category.trim())) ||
      ("price" in updates && (!Number.isFinite(updates.price) || updates.price < 0)) ||
      ("stock" in updates && (!Number.isInteger(updates.stock) || updates.stock < 0)) ||
      ("image" in updates && typeof updates.image !== "string")
    ) {
      return res.status(400).json({ message: "Invalid product details" });
    }

    for (const key of ["name", "description", "category"]) {
      if (key in updates) updates[key] = updates[key].trim();
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch {
    res.status(400).json({ message: "Failed to update product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch {
    res.status(400).json({ message: "Failed to delete product" });
  }
};