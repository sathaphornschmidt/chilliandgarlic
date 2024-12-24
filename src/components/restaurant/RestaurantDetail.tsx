import React, { useState } from "react";
import "./style.css";

const RestaurantDetail = () => {
  return (
    <div className="Res-detail">
      <div className="left">
        <h1>Chilli'n Garlic</h1> <br />
        <h2>
          Opening Hours <br /> Tuesday - Saturday 16:00 - 22:00
        </h2>
        <p>
          We are dedicated to conveying the authentic flavors and culture of
          Thailand. We use fresh, high-quality ingredients and spices, carefully
          crafted by experienced chefs from both Thailand and Germany. Each dish
          is thoughtfully created to offer a true taste of Thai cuisine,
          capturing the essence and uniqueness of Thai culinary traditions in
          every bite.
        </p>
      </div>
      <div className="right">
        <img src="img/chef.jpg" alt="" />
      </div>
    </div>
  );
};

export default RestaurantDetail;
