const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route Post /api/products
// @desc Create a new Product
// @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
        } = req.body;

        const product = new Product({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            user: req.user._id, // Reference to the admin user who created it
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

// @route PUT /api/products/:id
// @desc Update an existing product by its ID
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
        } = req.body;

        // Find product by ID
        const product = await Product.findById(req.params.id);

        if (product) {
            // Update the product with the values from the request body
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.countInStock = countInStock || product.countInStock;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.sizes = sizes || product.sizes;
            product.colors = colors || product.colors;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.gender = gender || product.gender;
            product.images = images || product.images;
            product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
            product.tags = tags || product.tags;
            product.dimensions = dimensions || product.dimensions;
            product.weight = weight || product.weight;
            product.sku = sku || product.sku;

            // Save the updated product
            const updatedProduct = await product.save();
            res.status(200).json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route DELETE /api/products/:id
// @desc Delete a product by ID
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        // Find the product by ID
        const product = await Product.findById(req.params.id);

        if (product) {
            // Remove the product from DB
            await product.deleteOne();
            res.json({ message: "Product Removed" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

// @route GET /api/products
// @desc Get all products with optional query filters
// @access Public
router.get("/", async (req, res) => {
    try {
        const {
            collection, size, color, gender, minPrice, maxPrice, sortBy,
            search, category, material, brand, limit
        } = req.query;

        let query = {};  // Define query object here

        // Filter logic
        if (collection && collection.toLowerCase() !== "all") {
            query.collections = collection;
        }

        if (category && category.toLowerCase() !== "all") {
            query.category = { $regex: new RegExp(category, 'i') };  // Case-insensitive search
        }

        if (material) {
            query.material = { $in: material.split(",") };
        }

        if (brand) {
            query.brand = { $in: brand.split(",") };
        }

        if (size) {
            query.sizes = { $in: size.split(",") };
        }

        if (color) {
            query.colors = { $in: [color] };
        }

        if (gender) {
            query.gender = gender;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        // Sort Logic
        let sort = {};
        if (sortBy) {
            switch (sortBy) {
                case "priceAsc":
                    sort = { price: 1 };
                    break;
                case "priceDesc":
                    sort = { price: -1 };
                    break;
                case "popularity":
                    sort = { rating: -1 };
                    break;
                default:
                    break;
            }
        }

        // Fetch products and apply sorting, limit
        let products = await Product.find(query).sort(sort).limit(Number(limit) || 0);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// @route GET /api/products/best-seller
// @desc Retrieve the product with the highest rating
// @access Public
router.get("/best-seller", async (req, res) => {
    try {
        const bestSeller = await Product.findOne().sort({ rating: -1 });
        if (bestSeller) {
            res.json(bestSeller);
        } else {
            res.status(404).json({ message: "No Best Seller Found "});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


// @route GET /api/products/new-arrivals
// @desc Retrive latest 8 products - Creation date
// @access Public

router.get("/new-arrivals", async (req, res) => {
    try {
        // Fetch lastest 8 products
        const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
        res.json(newArrivals);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});



// @route GET /api/products/:id
// @desc Retrieve single product by its ID
// @access Public
router.get("/:id", async (req, res) => {
    try {
        if (req.params.id === "best-seller") {
            return res.send("this should work");
        }

        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(400).json({ message: "Product Not Found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

// @route GET api/products/similar/:id
// @desc Retrieve similar products based on the current product's gender and category
// @access Public
router.get("/similar/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product Not Found" });
        }

        const similarProducts = await Product.find({
            _id: { $ne: id },  // Exclude the current product ID
            gender: product.gender,
            category: product.category,
        }).limit(4);

        res.json(similarProducts);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
