import heroImg from "../../assets/rabbit-hero.webp";
import { Link } from 'react-router-dom'; 
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

    const handleScrollToNewArrivals = () => {
        navigate("/");
        setTimeout(() => {
            const section = document.getElementById("new-arrivals");
            if (section) {
                section.scrollIntoView({ behavior: "smooth" });
            }
        }, 100);  // Slight delay to ensure rendering
    };
    
  return ( 
  <section className="relative">
    <img 
    src= {heroImg} alt="Rabbit"
    className="w-full h-[400px]  md:h-[600px] object-cover"
    />

     <div className="absolute inset-0 bg-black bg-opacity-5 flex items-center justify-center">
    <div className="text-center text-white p-6">
        <h1 className="text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4">
        Vacation <br /> Ready
        </h1>
        <p className="text-sm tracking-tighter md:text-lg mb-6">
            Explore our vacation-ready outfits with fast worldwide shipping.
        </p>
        <button 
                        onClick={handleScrollToNewArrivals} 
                        className="bg-white text-gray-950 px-6 py-2 rounded-sm text-lg"
                    >
                        Shop Now
                    </button>
    </div>

</div>

  </section>

  );
  
};
export default Hero;
