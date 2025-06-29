
### 🛒 An Ecommerce Website (Clothing)

A full-stack e-commerce website with user authentication, product listings, cart functionality, and image upload.

🔗 [Live Demo](https://flipzon-975h.onrender.com)

**Tech Stack:**
-
- **Frontend:** React, TailwindCSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **APIs & Services:** Cloudinary (image uploads), JWT (auth), Mongoose, MongoDB(database) , Razorpay(Payment Integration)

**Flow of things:**
- 
*Backend:*
- server.js file is the main one.
- routes contains 
- models contain the structural elements
- data contains the products
- middleware folder contains authorisations
- config helps connection files before website starts

*Frontend:*
- assets contain the background images of website
- components contain different modules in the website
- pages contain the designing and structural constructions of the respective webpages
- They check the authorization of each request and then they give permission to respond
- App.jsx file contains the styling part using tailwindCSS

.gitignore contains ignored files.

**To run locally:**

```bash
# Start backend
cd backend
npm install
npm run dev

# Start frontend
cd ../frontend
npm install
npm run dev