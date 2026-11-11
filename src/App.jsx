
import React, { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaBars,
  FaTimes,
  FaShoppingBag,
  FaArrowRight,
  FaArrowLeft,
  FaStar,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaHeart,
  FaPlus,
  FaCheck,
} from "react-icons/fa";

import "./style.css";

// HERO BACKGROUND
import heroImage from "./assets/venum-hero.jpg";

// CATEGORY IMAGES
import categoryTshirt from "./assets/category-tshirt.png";
import categoryHoodie from "./assets/category-hoodie.png";

// PRODUCT IMAGES
import product1 from "./assets/product-1.png";
import product2 from "./assets/product-2.png";
import product3 from "./assets/product-3.png";
import product4 from "./assets/product-4.png";
import product5 from "./assets/product-5.png";
import product6 from "./assets/product-6.png";

// MODEL IMAGES
import model1 from "./assets/model-1.png";
import model2 from "./assets/model-2.png";
import model3 from "./assets/model-3.png";
import model4 from "./assets/model-4.png";

// ACCORDION IMAGES
import accordion1 from "./assets/accordion-1.jpg";
import accordion2 from "./assets/accordion-2.jpg";
import accordion3 from "./assets/accordion-3.jpg";
import accordion4 from "./assets/accordion-4.jpg";


// PRODUCTS DATA
const products = [
  {
    id: 1,
    name: "OVERSIZED SHADOW",
    category: "T-Shirt",
    price: 1299,
    oldPrice: 1699,
    image: product1,
    tag: "BEST SELLER",
  },
  {
    id: 2,
    name: "VENUM STREET",
    category: "Hoodie",
    price: 1999,
    oldPrice: 2499,
    image: product2,
    tag: "TRENDING",
  },
  {
    id: 3,
    name: "URBAN GRAPHIC",
    category: "T-Shirt",
    price: 1099,
    oldPrice: 1499,
    image: product3,
    tag: "NEW",
  },
  {
    id: 4,
    name: "ESSENTIAL BLACK",
    category: "Hoodie",
    price: 2199,
    oldPrice: 2699,
    image: product4,
    tag: "POPULAR",
  },
  {
    id: 5,
    name: "SIGNATURE OVERSIZED",
    category: "T-Shirt",
    price: 1399,
    oldPrice: 1799,
    image: product5,
    tag: "NEW",
  },
  {
    id: 6,
    name: "PREMIUM STREET",
    category: "Hoodie",
    price: 2299,
    oldPrice: 2799,
    image: product6,
    tag: "LIMITED",
  },
];


// ACCORDION DATA
const accordionItems = [
  {
    title: "OVERSIZED T-SHIRTS",
    image: accordion1,
    number: "01",
  },
  {
    title: "STREET HOODIES",
    image: accordion2,
    number: "02",
  },
  {
    title: "GRAPHIC COLLECTION",
    image: accordion3,
    number: "03",
  },
  {
    title: "PREMIUM ESSENTIALS",
    image: accordion4,
    number: "04",
  },
];


// CAROUSEL DATA
const carouselModels = [
  {
    image: model1,
    title: "THE STREET ICON",
    subtitle: "OWN YOUR STYLE",
  },
  {
    image: model2,
    title: "URBAN ENERGY",
    subtitle: "BREAK THE RULES",
  },
  {
    image: model3,
    title: "NEXT GENERATION",
    subtitle: "BE DIFFERENT",
  },
];


function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [activeAccordion, setActiveAccordion] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [filter, setFilter] = useState("All");
  const [favorites, setFavorites] = useState([]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // CART CHECKOUT STATES
  const [cartOpen, setCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [orderDetails, setOrderDetails] = useState(null);

  const heroRef = useRef(null);


  // ANIMATIONS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      offset: 80,
      easing: "ease-in-out",
    });

    const ctx = gsap.context(() => {
      gsap.from(".hero-heading span", {
        y: 80,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: "power4.out",
      });

      gsap.from(".hero-description", {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.6,
      });

      gsap.from(".hero-buttons", {
        y: 25,
        opacity: 0,
        duration: 1,
        delay: 0.8,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);


  // CART
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };


  // CHANGE QUANTITY
  const changeQuantity = (id, amount) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };


  // FAVORITES
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };


  // PRODUCT FILTER
  const filteredProducts =
    filter === "All"
      ? products
      : products.filter(
          (item) => item.category === filter
        );


  // CART TOTALS
  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  // CONFIRM ORDER
  const confirmOrder = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const order = {
      id: "VENUM" + Date.now().toString().slice(-6),
      customer: { ...customer },
      items: cart.map((item) => ({ ...item })),
      total: totalPrice,
      date: new Date().toLocaleDateString("en-IN"),
    };

    setOrderDetails(order);
    setOrderPlaced(true);
    setCart([]);
    setCartOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // CAROUSEL
  const nextSlide = () => {
    setActiveSlide(
      (prev) => (prev + 1) % carouselModels.length
    );
  };

  const prevSlide = () => {
    setActiveSlide(
      (prev) =>
        (prev - 1 + carouselModels.length) %
        carouselModels.length
    );
  };

  const getSlidePosition = (index) => {
    return (
      (index - activeSlide + carouselModels.length) %
      carouselModels.length
    );
  };


  // NEWSLETTER
  const handleSubscribe = (e) => {
    e.preventDefault();

    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };


  // ORDER SUCCESS PAGE
  if (orderPlaced && orderDetails) {
    return (
      <div className="order-success-page">
        <div className="success-card">
          <div className="success-icon">
            <FaCheck />
          </div>

          <span className="success-label">VENUM STREETWEAR</span>

          <h1>
            ORDER <span>PLACED!</span>
          </h1>

          <p>
            Thank you for shopping with VENUM.
            Your order has been successfully placed.
          </p>

          <div className="order-info">
            <div>
              <span>ORDER ID</span>
              <strong>{orderDetails.id}</strong>
            </div>

            <div>
              <span>CUSTOMER</span>
              <strong>{orderDetails.customer.name}</strong>
            </div>

            <div>
              <span>PHONE</span>
              <strong>{orderDetails.customer.phone}</strong>
            </div>

            <div>
              <span>ORDER DATE</span>
              <strong>{orderDetails.date}</strong>
            </div>

            <div>
              <span>TOTAL AMOUNT</span>
              <strong>
                ₹{orderDetails.total.toLocaleString("en-IN")}
              </strong>
            </div>

            <div>
              <span>DELIVERY ADDRESS</span>
              <strong>{orderDetails.customer.address}</strong>
            </div>
          </div>

          <h3>ORDER SUMMARY</h3>

          <div className="success-products">
            {orderDetails.items.map((item) => (
              <div className="success-product" key={item.id}>
                <img src={item.image} alt={item.name} />

                <div>
                  <h4>{item.name}</h4>
                  <span>Quantity: {item.quantity}</span>
                </div>

                <strong>
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </strong>
              </div>
            ))}
          </div>

          <div className="success-buttons">
            <button
              onClick={() => {
                setOrderPlaced(false);
                setOrderDetails(null);
                setCustomer({
                  name: "",
                  phone: "",
                  address: "",
                });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              CONTINUE SHOPPING <FaArrowRight />
            </button>
          </div>

          <span className="success-thankyou">
            THANK YOU FOR CHOOSING VENUM.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="venum-site">


      {/* NAVBAR */}

      <nav className="navbar custom-navbar">
        <div className="container-fluid nav-inner">

          <a href="#home" className="navbar-brand venum-logo">
            VEN<span>UM</span>
          </a>

          <div className={`nav-links ${menuOpen ? "active" : ""}`}>

            {["Home", "Collection", "Products", "About", "Contact"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </a>
              )
            )}

          </div>

          <div className="nav-actions">

            <button
              type="button"
              className="cart-icon"
              onClick={() => setCartOpen(true)}
              aria-label="Open shopping cart"
            >
              <FaShoppingBag />
              <span>{totalItems}</span>
            </button>

            <button
              className="menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>

          </div>

        </div>
      </nav>


      {/* HERO */}

      <section
        className="hero-section"
        id="home"
        ref={heroRef}
        style={{
          backgroundImage: `url("${heroImage}")`,
        }}
      >

        <div className="hero-overlay"></div>

        <div className="container-fluid hero-container">

          <div className="row align-items-center">

            <div className="col-lg-7 hero-content">

              <div className="hero-small-label">
                <span></span> PREMIUM FIGHTWEAR
              </div>

              <h1 className="hero-heading">
                <span>VENUM</span>
                <span className="outline-text">T-SHIRTS &</span>
                <span><b>HOODIES.</b></span>
              </h1>

              <p className="hero-description">
                Train Hard. Wear Venum.
                Discover premium oversized T-shirts and
                hoodies designed for those who stand apart.
              </p>

              <div className="hero-buttons">

                <a href="#products" className="primary-btn">
                  SHOP COLLECTION <FaArrowRight />
                </a>

                <a href="#about" className="secondary-btn">
                  DISCOVER MORE
                </a>

              </div>

              <div className="hero-stats">

                <div>
                  <h3>100%</h3>
                  <p>PREMIUM QUALITY</p>
                </div>

                <div>
                  <h3>NEW</h3>
                  <p>STREET CULTURE</p>
                </div>

                <div>
                  <h3>24/7</h3>
                  <p>OWN YOUR STYLE</p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* MARQUEE */}

      <div className="marquee-section">
        <div className="marquee-track">

          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i}>
              VENUM STREETWEAR <b>✳</b> NO LIMITS
              <b>✳</b> OWN YOUR STYLE <b>✳</b>
            </span>
          ))}

        </div>
      </div>

{/* COLLECTION */}

<section
  className="collection-section section-space"
  id="collection"
>
  <div className="container-fluid section-container">

    <div className="section-top" data-aos="fade-up">

      <div>
        <h2>
          EXPLORE THE <span>DROP.</span>
        </h2>
      </div>

      <p>
        Express your identity. Elevate your everyday look.
        Discover streetwear made for the fearless.
      </p>

    </div>

    <div className="row g-4 category-row">

      <div className="col-md-6" data-aos="fade-right">

        <a href="#products" className="category-card">

          <img
            src={categoryTshirt}
            alt="Men's oversized graphic T-shirts"
          />

          <div className="category-overlay">
            <h3>
              GRAPHIC<br />TEES
            </h3>

            <div className="category-link">
              SHOP THE DROP <FaArrowRight />
            </div>
          </div>

        </a>

      </div>

      <div className="col-md-6" data-aos="fade-left">

        <a href="#products" className="category-card">

          <img
            src={categoryHoodie}
            alt="Premium streetwear hoodies"
          />

          <div className="category-overlay">
            <h3>
              PREMIUM<br />HOODIES
            </h3>

            <div className="category-link">
              FIND YOUR FIT <FaArrowRight />
            </div>
          </div>

        </a>

      </div>

    </div>

  </div>
</section>

      {/* HORIZONTAL ACCORDION */}

<section className="horizontal-accordion-section section-space">

  <div className="container-fluid section-container">

    <div className="section-heading" data-aos="fade-up">

      <span className="section-tag">
         THE VENUM EXPERIENCE
      </span>

      <h2>
        DEFINE YOUR <span>OWN GAME.</span>
      </h2>

      <p>
        From bold graphics to everyday essentials,
        discover styles that reflect your attitude.
      </p>

    </div>

    <div className="horizontal-accordion">

      {accordionItems.map((item, index) => (

        <div
          className={`accordion-card ${
            activeAccordion === index ? "expanded" : ""
          }`}
          key={item.number}
          onMouseEnter={() => setActiveAccordion(index)}
          onClick={() => setActiveAccordion(index)}
        >

          <img
            src={item.image}
            alt={item.title}
          />

          <div className="accordion-shade"></div>

          
          <div className="accordion-content">

            <h3>{item.title}</h3>

            <span>
              DISCOVER MORE 
            </span>

          </div>

        </div>

      ))}

    </div>

  </div>

</section>
{/* NEON CARDS */}

<section className="neon-section section-space">

  <div className="container-fluid section-container">

    <div
      className="section-heading-center"
      data-aos="zoom-in"
    >

      <span className="section-tag">
        THE VENUM STANDARD
      </span>

      <h2>
        NOT MADE TO <span>FIT IN.</span>
      </h2>

      <p>
        Create your own identity. Wear what represents you.
        Be unapologetically different.
      </p>

    </div>

    <div className="neon-grid">

      <motion.div
        className="neon-card neon-one"
        whileHover={{ y: -15, scale: 1.02 }}
      >
        <span>FEARLESS ATTITUDE</span>

        <h3>
          STAY<br />BOLD.<br /><b>STAY REAL.</b>
        </h3>

       
      </motion.div>

      <motion.div
        className="neon-card neon-two"
        whileHover={{ y: -15, scale: 1.02 }}
      >
        <span>EVERYDAY ESSENTIALS</span>

        <h3>
          FEEL<br />THE<br /><b>DIFFERENCE.</b>
        </h3>

       
      </motion.div>

      <motion.div
        className="neon-card neon-three"
        whileHover={{ y: -15, scale: 1.02 }}
      >
        <span>UNLIMITED EXPRESSION</span>

        <h3>
          YOUR<br />STYLE.<br /><b>YOUR RULES.</b>
        </h3>

        
      </motion.div>

    </div>

  </div>

</section>
{/* 3D CAROUSEL */}

<section className="carousel-section section-space">

  <div className="container-fluid section-container">

    <div
      className="section-heading-center"
      data-aos="fade-up"
    >
      <span className="section-tag">
        THE STYLE EDIT
      </span>

      <h2>
        MADE TO <span>STAND OUT.</span>
      </h2>

      <p>
        Explore exclusive streetwear looks.
        Every fit tells a different story.
      </p>
    </div>

    <div className="carousel-stage">

      {carouselModels.map((model, index) => {

        const position = getSlidePosition(index);

        return (
          <motion.div
            key={index}
            className={`carousel-model position-${position}`}
            animate={{
              x:
                position === 0
                  ? "-50%"
                  : position === 1
                  ? "45%"
                  : "-145%",

              y: "-50%",

              scale: position === 0 ? 1 : 0.75,

              rotateY:
                position === 0
                  ? 0
                  : position === 1
                  ? -35
                  : 35,

              opacity: position === 0 ? 1 : 0.55,

              zIndex: position === 0 ? 3 : 1,
            }}
            transition={{
              duration: 0.7,
              ease: "easeInOut",
            }}
          >

            <img
              src={model.image}
              alt={model.title}
            />

            <div className="carousel-model-content">

              <span>{model.subtitle}</span>

              <h3>{model.title}</h3>

            </div>

          </motion.div>
        );

      })}

      <button
        className="carousel-control prev"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <FaArrowLeft />
      </button>

      <button
        className="carousel-control next"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <FaArrowRight />
      </button>

    </div>

    <div className="carousel-indicators">

      {carouselModels.map((_, index) => (

        <button
          key={index}
          className={
            activeSlide === index ? "active" : ""
          }
          onClick={() => setActiveSlide(index)}
          aria-label={`Go to slide ${index + 1}`}
        />

      ))}

    </div>

  </div>

</section>

      {/* PRODUCTS */}

<section
  className="products-section section-space"
  id="products"
>

  <div className="container-fluid section-container">

    <div className="section-top" data-aos="fade-up">

      <div>

        <span className="section-tag">
           EXCLUSIVE RELEASES
        </span>

        <h2>
          THE LATEST <span>DROPS.</span>
        </h2>

      </div>

      <div className="product-filters">

        {["All", "T-Shirt", "Hoodie"].map((item) => (

          <button
            key={item}
            className={
              filter === item ? "active" : ""
            }
            onClick={() => setFilter(item)}
          >
            {item}
          </button>

        ))}

      </div>

    </div>

    <div className="row g-4">

      <AnimatePresence mode="popLayout">

        {filteredProducts.map((product, index) => (

          <div
            className="col-6 col-md-4 col-xl-4 col-xxl-4"
            key={product.id}
          >

            <motion.div
              className="product-card"
              layout
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
              }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
              }}
            >

              <div className="product-image">

                <img
                  src={product.image}
                  alt={product.name}
                />

                <span className="product-tag">
                  {product.tag}
                </span>

                <button
                  className={`favorite-btn ${
                    favorites.includes(product.id)
                      ? "liked"
                      : ""
                  }`}
                  onClick={() =>
                    toggleFavorite(product.id)
                  }
                  aria-label="Toggle favorite"
                >
                  <FaHeart />
                </button>

                <button
                  className="quick-add"
                  onClick={() =>
                    addToCart(product)
                  }
                >
                  <FaPlus /> ADD TO BAG
                </button>

              </div>

              <div className="product-details">

                <span>{product.category}</span>

                <h3>{product.name}</h3>

                <div className="product-price">

                  <strong>
                    ₹{product.price.toLocaleString("en-IN")}
                  </strong>

                  <del>
                    ₹{product.oldPrice.toLocaleString("en-IN")}
                  </del>

                </div>

              </div>

            </motion.div>

          </div>

        ))}

      </AnimatePresence>

    </div>

  </div>

</section>

      {/* BRAND BANNER */}

<section
  className="brand-banner"
  data-aos="zoom-in"
>

  <div className="container-fluid section-container">

    <span>
      VENUM / BEYOND THE ORDINARY
    </span>

    <h2>
      YOUR STYLE.<br />
      <b>YOUR IDENTITY. YOUR LEGACY.</b>
    </h2>

    <a href="#products" className="primary-btn">
      EXPLORE THE COLLECTION <FaArrowRight />
    </a>

    <div className="banner-watermark">
      VM
    </div>

  </div>

</section>

{/* ABOUT */}

<section
  className="about-section section-space"
  id="about"
>

  <div className="container-fluid section-container">

    <div className="row align-items-center g-5">

      <div
        className="col-lg-6"
        data-aos="fade-right"
      >

        <div className="about-visual">

          <img
            src={model4}
            alt="VENUM streetwear collection"
          />

          <span className="about-outline">
            VENUM
          </span>

          <div className="about-small-box">

            <h3>OWN YOUR LOOK.</h3>

            <p>
              MAKE EVERY OUTFIT COUNT.
            </p>

          </div>

        </div>

      </div>

      <div
        className="col-lg-6"
        data-aos="fade-left"
      >

        <span className="section-tag">
          THE VENUM STORY
        </span>

        <h2 className="about-heading">
          FASHION WITH<br />
          <span>AN ATTITUDE.</span>
        </h2>

        <p className="about-description">
          VENUM represents a generation that refuses to
          blend in. We believe streetwear is more than
          a trend — it's a powerful way to express who
          you are.
        </p>

        <p className="about-description">
          Every piece is created with a focus on modern
          aesthetics, effortless comfort and distinctive
          details. From statement T-shirts to everyday
          hoodies, we bring confidence into every fit.
        </p>

        <div className="about-features">

          <div><FaCheck /> Premium Fabric Selection</div>
          <div><FaCheck /> Contemporary Street Style</div>
          <div><FaCheck /> Distinctive Design Details</div>
          <div><FaCheck /> Comfort Meets Confidence</div>

        </div>

       

      </div>

    </div>

  </div>

</section>
{/* TESTIMONIALS */}

<section className="testimonial-section section-space">

  <div className="container-fluid section-container">

    <div
      className="section-heading-center"
      data-aos="fade-up"
    >

      <span className="section-tag">
        THE VENUM COMMUNITY
      </span>

      <h2>
        WORN WITH <span>CONFIDENCE.</span>
      </h2>

      <p>
        Discover what makes the VENUM streetwear experience different.
      </p>

    </div>

    <div className="row g-4 mt-3">

      {[
        {
          name: "ARJUN K",
          city: "CHENNAI",
          review:
            "The fit is exactly what I was looking for. Bold design, great comfort and an amazing streetwear vibe!",
        },
        {
          name: "RAHUL M",
          city: "BANGALORE",
          review:
            "Love the attention to detail. The hoodie feels comfortable and gives my everyday outfit a whole new look.",
        },
        {
          name: "VIKRAM S",
          city: "COIMBATORE",
          review:
            "Finally found a brand that matches my style. Clean designs, standout looks and effortless confidence!",
        },
      ].map((item, index) => (

        <div
          className="col-md-4"
          key={item.name}
          data-aos="fade-up"
          data-aos-delay={index * 150}
        >

          <div className="testimonial-card">

            <div className="testimonial-stars">

              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} />
              ))}

            </div>

            <p>
              "{item.review}"
            </p>

            <div className="testimonial-author">

              <div className="author-avatar">
                {item.name.charAt(0)}
              </div>

              <div>
                <h4>{item.name}</h4>
                <span>{item.city}</span>
              </div>

            </div>

          </div>

        </div>

      ))}

    </div>

  </div>

</section>

     {/* NEWSLETTER */}

<section
  className="newsletter-section"
  id="contact"
>

  <div className="container-fluid section-container">

    <div
      className="newsletter-content"
      data-aos="zoom-in"
    >

      <span className="section-tag">
        NEVER MISS A DROP
      </span>

      <h2>
        GET THE <span>FIRST LOOK.</span>
      </h2>

      <p>
        Be the first to discover exclusive releases,
        fresh streetwear drops and members-only offers.
      </p>

      <form
        onSubmit={handleSubscribe}
        className="newsletter-form"
      >

        <input
          type="email"
          placeholder="Your email address goes here"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">
          {subscribed
            ? "YOU'RE IN ✓"
            : "GET ACCESS"}

          <FaArrowRight />
        </button>

      </form>

      {subscribed && (
        <p className="subscribe-success">
          Welcome to the VENUM community. Stay ahead of the drop!
        </p>
      )}

    </div>

  </div>

</section>

{/* FOOTER */}

<footer className="footer-section">

  <div className="container-fluid section-container">

    <div className="row g-5">

      <div className="col-lg-5">

        <a href="#home" className="footer-logo">
          VEN<span>UM</span>
        </a>

        <p className="footer-description">
          Born from street culture. Driven by individuality.
          Designed for those who dare to stand apart.
          This is more than fashion. This is VENUM.
        </p>

        <div className="social-links">

          <a href="#contact" aria-label="Instagram">
            <FaInstagram />
          </a>

          <a href="#contact" aria-label="Facebook">
            <FaFacebookF />
          </a>

          <a href="#contact" aria-label="Twitter">
            <FaTwitter />
          </a>

        </div>

      </div>

      <div className="col-6 col-lg-2">

        <h4>DISCOVER</h4>

        <a href="#home">Home</a>
        <a href="#collection">Our Collection</a>
        <a href="#products">Shop All</a>
        <a href="#about">Our Story</a>

      </div>

      <div className="col-6 col-lg-2">

        <h4>SHOP BY STYLE</h4>

        <a href="#products">Graphic Tees</a>
        <a href="#products">Oversized Tees</a>
        <a href="#products">Street Hoodies</a>
        <a href="#products">Latest Drops</a>

      </div>

      <div className="col-lg-3">

        <h4>YOUR BAG</h4>

        <a
          href="#products"
          className="footer-shop-link"
        >
          EXPLORE THE STORE <FaArrowRight />
        </a>

      </div>

    </div>

    <div className="footer-bottom">

      <p>
        © 2026 VENUM. ALL RIGHTS RESERVED.
      </p>

      <p>
        OWN YOUR STYLE. OWN YOUR IDENTITY.
      </p>

    </div>

  </div>

</footer>

      {/* SHOPPING CART DRAWER */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          >
            <motion.div
              className="cart-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="cart-header">
                <div>
                  <span>VENUM SHOPPING</span>
                  <h2>YOUR BAG ({totalItems})</h2>
                </div>

                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  aria-label="Close cart"
                >
                  <FaTimes />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="empty-cart">
                  <FaShoppingBag />
                  <h3>Your Bag Is Empty</h3>
                  <p>Add your favourite streetwear products.</p>
                  <button
                    type="button"
                    onClick={() => setCartOpen(false)}
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div className="cart-item" key={item.id}>
                        <img src={item.image} alt={item.name} />

                        <div className="cart-item-info">
                          <h3>{item.name}</h3>

                          <strong>
                            ₹{item.price.toLocaleString("en-IN")}
                          </strong>

                          <div className="quantity-controls">
                            <button
                              type="button"
                              onClick={() => changeQuantity(item.id, -1)}
                              aria-label={`Decrease ${item.name} quantity`}
                            >
                              -
                            </button>

                            <span>{item.quantity}</span>

                            <button
                              type="button"
                              onClick={() => changeQuantity(item.id, 1)}
                              aria-label={`Increase ${item.name} quantity`}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="remove-cart-item"
                          onClick={() =>
                            setCart((prev) =>
                              prev.filter((product) => product.id !== item.id)
                            )
                          }
                          aria-label={`Remove ${item.name}`}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="cart-checkout">
                    <div className="cart-total">
                      <span>SUBTOTAL</span>
                      <strong>
                        ₹{totalPrice.toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <h3>DELIVERY DETAILS</h3>

                    <form onSubmit={confirmOrder}>
                      <input
                        type="text"
                        placeholder="Your Full Name"
                        value={customer.name}
                        onChange={(e) =>
                          setCustomer((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        required
                      />

                      <input
                        type="tel"
                        placeholder="10-digit Phone Number"
                        value={customer.phone}
                        onChange={(e) =>
                          setCustomer((prev) => ({
                            ...prev,
                            phone: e.target.value.replace(/\\D/g, "").slice(0, 10),
                          }))
                        }
                        pattern="[0-9]{10}"
                        maxLength={10}
                        inputMode="numeric"
                        required
                      />

                      <textarea
                        placeholder="Full Delivery Address"
                        value={customer.address}
                        onChange={(e) =>
                          setCustomer((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        required
                      />

                      <button type="submit" className="confirm-order-btn">
                        CONFIRM ORDER <FaArrowRight />
                      </button>
                    </form>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING CART */}
      <button
        type="button"
        className="floating-cart"
        onClick={() => setCartOpen(true)}
        aria-label="Open shopping cart"
      >
        <FaShoppingBag />
        <span>{totalItems}</span>
      </button>

    </div>
  );
}

export default App;
