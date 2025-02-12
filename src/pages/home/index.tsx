import React from "react";
import Navbar from "../../components/layout/nav/Navbar";
import RestaurantDetail from "../../components/restaurant/RestaurantDetail";
import ReservationForm from "../../components/reservation/ReservationForm";
import Footer from "../../components/layout/footer/Footer";
import AboutUs from "../../components/layout/AboutUs";
import "../../App.css";

const Home = () => {
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      <section id="rostock" className="Rostock">
        <div className="con-slogan">
          <p>
            Thailand Inspired kitchen <br />
            in the Heart of Rostock{" "}
          </p>
        </div>
      </section>

      <RestaurantDetail />
      <section id="menu-sections">
        <h2>Menu</h2>
        <div className="menu-container">
          <div className="menu-item">
            <img src="img/ข้าวผัดสัปรด.jpg" alt="" />
            <h3>Fried Rice</h3>
            <p>Beef / Chicken / Pork / Shrimp / Pineapple </p>
          </div>

          <div className="menu-item">
            <img src="img/ต้มยำกุ้ง.jpg" alt="" />
            <h3>Tom Yum Soup</h3>
            <p>Seafoods / Chicken / Pork </p>
          </div>

          <div className="menu-item">
            <img src="img/แกงเขียวหวาน.jpg" alt="" />
            <h3>Green Curry</h3>
            <p>Beef / Chicken / Pork / Shrimp</p>
          </div>

          <div className="menu-item">
            <img src="img/มัสมั่น.png" alt="" />
            <h3>Massaman Curry</h3>
            <p>Beef / Chicken / Pork / Shrimp </p>
          </div>

          <div className="menu-item">
            <img src="img/ผัดไทย.jpg" alt="" />
            <h3>Pad Thai</h3>
            <p>Shrimp / Chicken / Pork </p>
          </div>

          <div className="menu-item">
            <img src="img/กระเพรา.jpg" alt="" />
            <h3>Fried Basil</h3>
            <p>Beef / Chicken / Pork / Shrimp / Belly pork </p>
          </div>

          <div className="menu-item">
            <img src="img/ข้าวมันไก่.jpg" alt="" />
            <h3>Steamed Rice Topped With Chicken</h3>
            <p>Belly Pork / Fried Chicken </p>
          </div>

          <div className="menu-item">
            <img src="img/กระเทียม.jpg" alt="" />
            <h3>Stir Fried Garlic</h3>
            <p>Beef / Chicken / Pork / Shrimp / Belly pork </p>
          </div>

          <div className="menu-item">
            <img src="img/ไข่พะโล้.jpg" alt="" />
            <h3>Stewed Eggs</h3>
            <p>Beef / Chicken Leg / Belly Pork </p>
          </div>
        </div>
      </section>

      <section id="dessert-sections">
        <h2>Dessert & Beverages </h2>
        <div className="dessert-container">
          <div className="dessert-item">
            <img src="img/ข้าวเหนียวมะม่วง.jpg" alt="" />
            <h3>Mango Sticky Rice</h3>
          </div>

          <div className="dessert-item">
            <img src="img/สังขยาฟักทอง.jpg" alt="" />
            <h3>Egg Custard in Pumpkin</h3>
          </div>

          <div className="dessert-item">
            <img src="img/กล้วงบวชชี.jpg" alt="" />
            <h3>Banana in Coconut Milk</h3>
          </div>

          <div className="dessert-item">
            <img src="img/beer.jpg" alt="" />
            <h3>Beer</h3>
            <p>Pils / Weizen / Hellas / Dunkeles / Radler ...</p>
          </div>

          <div className="dessert-item">
            <img src="img/cocktails.jpg" alt="" />
            <h3>Cocktails</h3>
            <p>
              {" "}
              Frozen Piña Colada / Mai Tai / Watermelon Margarita / Mojito /
              Spritz / The Old Fashioned / Long Island /Blue Hawaii ...
            </p>
          </div>

          <div className="dessert-item">
            <img src="img/beverages.jpg" alt="" />
            <h3>Drinks</h3>
            <p>
              Coke / Coke 0% Sugar / Sprite / Mineral Water / Sparkling Water
              ...
            </p>
          </div>
        </div>
      </section>

      <section id="offers-sections">
        <h2>OFFERS</h2>
        <div className="offers-container">
          <div className="offers-items">
            <img src="img/cocktails.jpg" alt="" />
            <h3>Cocktails Hours</h3>
            <p>
              {" "}
              Buy 2 Get 1 Free On Cocktails <br /> Friday - Saturday From 6 PM -
              8 PM
            </p>
          </div>

          <div className="offers-items">
            <img src="img/beer.jpg" alt="" />
            <h3>Beer Hours</h3>
            <p>
              {" "}
              Buy 3 Get 1 Free All Beer <br /> Tuesday - Thursday From 6 PM - 8
              PM
            </p>
          </div>
        </div>
      </section>

      <section id="aboutus-sections">
        <AboutUs />
      </section>
      <section id="aboutus-res">
        <div className="aboutus-res-container">
          <div className="aboutus-img">
            <img src="img/inside-res1.jpg" alt="" />
          </div>

          <div className="aboutus-img">
            <img src="img/inside-res2.jpg" alt="" />
          </div>

          <div className="aboutus-img">
            <img src="img/inside-res3.jpg" alt="" />
          </div>

          <iframe
            src="https://www.google.com/maps/embed?pb=!4v1734340421070!6m8!1m7!1sCAoSLEFGMVFpcE5FaEREVlRZb1pZM1daQVlRQ1J4eTdGdnJSQkVqbEZwNnI5dGNC!2m2!1d54.08866432959075!2d12.11370360618827!3f285.0619244417662!4f-2.3998199046604185!5f0.7820865974627469"
            width="500"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
      <ReservationForm />
      <Footer />
    </div>
  );
};

export default Home;
