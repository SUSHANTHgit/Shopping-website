import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductDetails, updateProduct } from '../../redux/slices/productsSlice';
import axios from "axios";
import { updateProductInState } from '../../redux/slices/adminProductSlice';

const EditProductPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { selectedProduct, loading, error } = useSelector((state) => state.products);


    const [productData, setProductData] = useState({
        name:"",
        description:"",
        price:"",
        countInStock: 0,
        sku: "",
        category: "",
        brand:"",
        sizes: [],
        colors: [],
        collections: "",
        material: "",
        gender: "",
        images: [],
    });


    const [uploading, setuploading] = useState(false);   //Image uploading state

    useEffect(() => {
        if (id) {
            dispatch(fetchProductDetails(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (selectedProduct) {
            setProductData(selectedProduct);
        }
    }, [selectedProduct]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({...prevData, [name]:value }));

    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);

        try {
            setuploading(true);
            const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`,
                formData,
                {
                    header: { "content-Type": "multipart/form-data"},
                }
            );
            setProductData((prevData) => ({
                ...prevData,
                images: [...prevData.images, {url: data.imageUrl, altText: ""}],
            }));
            setuploading(false);
        } catch (error) {
            console.error(error);
            setuploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const resultAction = await dispatch(updateProduct({ id, productData })).unwrap();
    
            // Optimistically update Redux state with new product data
            dispatch(updateProductInState(resultAction));  
    
            navigate("/admin/products");
    
        } catch (error) {
            console.error("Failed to update product:", error);
            alert("Failed to update product. Please try again.");
        }
    };
    

    if(loading) return <p>Loading...</p>;
    if(error) return <p>Error:{error}...</p>;


  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
    <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
    <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-6">
            <label className="block font-semibold mb-2">Product Name</label>
            <input type="text"
             name="name"
             value={productData.name}
             onChange={handleChange} 
             className="w-full border border-x-gray-300 rounded-md p-2"
             required
             />
        </div>

        {/* Description */}

        <div className="mb-6">
            <label className="block font-semibold mb-2">Description</label>
        <textarea name="description" value={productData.description}
         className="w-full border border-gray-300 rounded-md p-2" 
         onChange={handleChange}
         rows={4}
         required
         />
        </div>

        {/* Price */}

        <div className="mb-6">
            <label className="block font-semibold mb-2">Price</label>
            <input
            type="number" 
            name="price" 
            value={productData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            />
        </div>

        {/* Count in Stock */}

        <div className="mb-6">
            <label className="block font-semibold mb-2">Count in Stock</label>
            <input
            type="number" 
            name="countInStock" 
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            />
        </div>

        {/* SKU */}

        <div className="mb-6">
            <label className="block font-semibold mb-2">SKU</label>
            <input type="text" 
            name="sku" 
            value={productData.sku}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            />
        </div>

        {/* Sizes */}

        <div className="mb-6">
            <label className="block font-semibold mb-2">
                Sizes (comma-seperated)
            </label>
            <input type="text" 
            name="sizes" 
            value={productData.sizes.join(",")}
            onChange={(e) => setProductData({...productData, sizes: e.target.value.split(",").map((size) => size.trim()),

            })
        }
            className="w-full border border-gray-300 rounded-md p-2"
            />
        </div>

         {/* colors */}

         <div className="mb-6">
            <label className="block font-semibold mb-2">
                Colors (comma-seperated)
            </label>
            <input
    type="text"
    name="colors"
    value={productData.colorsRaw || productData.colors.join(",")}  // Display raw value while typing
    onChange={(e) => {
        const rawValue = e.target.value;  // Store raw input value
        setProductData((prev) => ({
            ...prev,
            colorsRaw: rawValue,  // Store raw value temporarily
            colors: rawValue.split(",").map((color) => color.trim())  // Split & trim later
        }));
    }}
    className="w-full border border-gray-300 rounded-md p-2"
/>

        </div>

        {/* Image Upload */}

        <div className="mb-6">
            <label className="block font-semibold mb-2">Upoad Image</label>
            <input type="file" onChange={handleImageUpload} />
            {uploading && <p>Uploading image...</p>}
            <div className="flex gap-4 mt-4">
            {productData.images.map((image, index) => (
                <div key={index}>
                <img src={image.url} alt={image.altText || "Product Image"}
                className="w-20 h-20 object-cover rounded-md shadow-md"
                />
                
                
                
                
                 </div>
            ))}
            </div>
        </div>

            <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md
             hover:bg-green-600 transition-colors" >Update Product</button>


    </form>
    </div>
  );
};

export default EditProductPage;
