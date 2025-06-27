const express = require("express"); //done
const cors = require("cors");
const dotenv = require("dotenv"); //done
const connectDB = require("./config/db"); //done
const userRoutes = require("./routes/userRoutes"); //done
const productRoutes = require("./routes/productRoutes"); //done
const cartRoutes = require("./routes/cartRoutes"); //done
const checkoutRoutes = require("./routes/checkoutRoutes"); //done
const orderRoutes = require("./routes/orderRoutes"); //done
const uploadRoutes = require("./routes/uploadRoutes"); //done
const subscribeRoute = require("./routes/subscribeRoute"); //done
const adminRoutes = require("./routes/adminRoutes"); //done
const productAdminRoutes = require("./routes/productAdminRoutes"); //done
const adminOrderRoutes = require("./routes/adminOrderRoutes"); //done
const razorpayRoutes = require("./routes/razorpayRoutes");


const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB

app.get("/", (req, res) => {
    res.send("Welcome to Mahika API!");
});


//API Routes

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/subscribe", subscribeRoute);
app.use("/api", razorpayRoutes);



// Admin

app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);


// connect to MongoDB and then listen
connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        
    });
})