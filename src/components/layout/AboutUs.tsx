import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <section id="aboutus-sections">
      <h2>ABOUT US</h2>
      <div className="aboutus-container">
        {/* Sathaphorn Schmidt Section */}
        <div className="aboutus">
          <img src="img/satha.jpg" alt="Sathaphorn Schmidt" />
          <h3>Sathaphorn Schmidt</h3>
          <p>
            "I have a deep passion for Thai food, which started as a personal
            experiment in my free time. With my love and pride for Thai cuisine,
            I decided to open my own restaurant and named it ‘Chilli’n Garlic’.
            The name reflects the importance of the two ingredients I love most
            in Thai food—chilli and garlic—along with the warm, welcoming
            feeling of sitting down to enjoy a delicious meal with family, just
            like being at home. Most importantly, I want to present Thai food in
            a way that retains its authentic and traditional identity. I’m
            confident that the Thai dishes here will make you feel like you're
            truly in Thailand."
          </p>
        </div>

        {/* Alexander Schmidt Section */}
        <div className="aboutus">
          <img src="img/Alex.JPG" alt="Alexander Schmidt" />
          <h3>Alexander Schmidt</h3>
          <p>
            "I discovered my passion for cooking early on. After some initial
            experiments in the kitchen, I began my training at the Seehotel Plau
            am See, where I learned the trade. After my training, I moved to
            Switzerland, where I worked for over 6 years in various kitchens,
            from ski huts to luxury 4* superior hotels. Upon returning to
            Germany, I attended hotel management school to apply my knowledge in
            my own restaurant. Since 2016, I have been running my
            restaurant/catering in the KTV district of Rostock, striving for the
            best for my employees and guests."
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
