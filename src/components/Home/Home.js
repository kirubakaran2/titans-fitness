import React from "react";
import { useState, useEffect } from "react";
import logo from "./img/web1.png";
import brand from "./img/logo2.jpg";
import bl from "./img/logo-1.png"
import girl from "./img/girlexe.jpg";
import Boy from "./img/trainer.jpg";
import Boy_2 from "./img/trainer2.jpg";
import Boy_3 from "./img/swag.jpg";
import insta from "./img/insta.png";
import whatsapp from "./img/whatsapp.png";
import loc from "./img/location.png";
import EquipmentGrid from "../Equipment";
import cb from "../../img/foot.png";

import "./Home.css";

import "../../styles/sty.css";
import { faUser, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faDumbbell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const handleLoginButtonClick = () => {
  window.location.href = "/login";
};

const HomePage = () => {
  const [showLoginButton, setShowLoginButton] = useState(true);
  const champions = [
    {
      image: Boy,
      text: `Some people enjoy the 
    social aspect of going to the gym, 
    where they can work out with friends, 
    join group classes, or meet like-minded individuals with similar fitness goals.`,
      sub: ` The gym is not just about building muscle; it's also about personal growth. Through consistent training and perseveranc.,`,
    },
    {
      image: Boy_2,
      text: `Engaging in regular exercise not only improves physical health but also boosts mental well-being. Many people find solace in their exercise routines, allowing them to destress and rejuvenate after a long day.`,
      sub: `Adopting a healthy lifestyle involves more than just physical activity; it encompasses nutrition, sleep, and stress management`,
    },
    {
      image: Boy_3,
      text: `For some, the gym serves as more than just a place to exercise; it's a community hub where individuals from diverse backgrounds come together. This sense of camaraderie fosters friendships and encourages mutual support in achieving fitness goals.`,
      sub: `Many gym-goers prioritize overall wellness, striving to maintain a balanced lifestyle that promotes longevity and vitality.`,
    },
    {
      image: Boy,
      text: `The gym is not just about building muscle; it's also about personal growth. Through consistent training and perseverance, individuals learn discipline, resilience, and the importance of setting and achieving goals.`,
      sub: ` Exercise can be a journey of self-discovery, allowing individuals to explore their physical capabilities and push beyond their perceived limits.`,
    },
    // Add more champions as needed
  ];

  const [currentChampion, setCurrentChampion] = useState(champions[0]);
  const [expandedRow, setExpandedRow] = useState(null);

  const handleChampionChange = (champion) => {
    setCurrentChampion(champion);
  };

  const handleRowClick = (row) => {
    if (expandedRow === row) {
      setExpandedRow(null);
    } else {
      setExpandedRow(row);
    }
  };
  useEffect(() => {
    setShowLoginButton(true);
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // If user has scrolled down, hide the login button
      if (scrollPosition > 0) {
        setShowLoginButton(false);
      } else {
        // If user is at the top of the page, show the login button
        setShowLoginButton(true);
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Clean up function to remove scroll event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${girl})` }}
    >
      <div className="h-screen flex flex-col justify-center items-center bg-opacity-50">
        <div className="absolute top-0 left-0 flex items-start px-10 py-10">
          <div className="flex items-start">
            <img
              src={brand}
              alt="Brand"
              className="mt-5 h-10 w-10 rounded-full sm:h-12 sm:w-12"
            />
            <img src={logo} alt="Logo" className="h-48 w-96 ml-2 mt-[-30px]" />
          </div>
        </div>
        {showLoginButton && (
          <div className="fixed top-5 md:top-0 right-2 md:right-20 p-2 md:p-4">
            <button
              className="rounded-full border border-white bg-transparent px-4 md:px-8 py-1 md:py-2 flex items-center justify-center text-white text-sm md:text-base"
              onClick={handleLoginButtonClick}
            >
              <FontAwesomeIcon icon={faUser} className="text-white mr-2" />
              Login
            </button>
          </div>
        )}
        <div className="font-nerwester">
          <div className="absolute left-1 md:right-1/4 lg:right-1/2 top-1/2 transform -translate-y-1/2 p-5 rounded-lg text-center font-norwester">
            <h1
              className="text-white text-4xl md:text-6xl lg:text-8xl mb-4"
              style={{
                letterSpacing: "2px",
                textShadow: "5px 2px 11px rgba(0,0,0,0.3)",
              }}
            >
              TRANSFORM YOUR
            </h1>
            <h1
              className="text-white text-4xl md:text-6xl lg:text-8xl mb-4"
              style={{
                letterSpacing: "3px",
                textShadow: "5px 2px 11px rgba(0,0,0,0.3)",
              }}
            >
              BODY AND LIFE
            </h1>
            <p className="text-white text-lg lg:text-xl">
              Gyms typically offer a wide range of exercise equipment.
            </p>
          </div>
        </div>
      </div>
      {/* Card 1 */}
      <div className="w-full max-w-sm lg:max-w-full lg:flex justify-center mt-10">
  <div className="h-96 lg:h-96 lg:w-96 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden">
    <img
      src={Boy}
      alt="Image of a person"
      className="h-full w-full object-cover"
    />
  </div>

  <div className="bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
    <div>
      <div className="text-gray-900 text-4xl mb-2 font-norwester">
        TITAN <span className="text-70AB0E-800"> FITNESS GYM </span>
      </div>
      <p className="text-gray-700 text-xl font-bold">About Us</p>
      <p className="text-gray-700 text-xl mt-2 text-justify">
        Titan Fitness Studio, Pondicherry's premier fitness center, opened
        on November 4, 2022, in a 1700 square feet, fully air-conditioned
        facility. We provide a welcoming ambiance, secure restrooms,
        dressing rooms with lockers, shoe racks, and Auro purifier water
        facilities. Our training sessions include strength, cardio,
        mobility, flexibility, weight management, muscle building, and
        bodybuilding transformations. We have certified, professional, and
        friendly trainers, offering both male and female coaches for
        client comfort. Catering to clients aged 13 and above, we have
        successfully served over 100 clients. Personal training is
        available, and we prioritize cleanliness and hygiene for our
        clients' well-being.
      </p>
    </div>
  </div>
</div>
      {/* Card 2 */}
      <div className="mt-10 p-6 lg:p-20 w-full max-w-sm lg:max-w-full lg:flex justify-center bg-darkblue-100">
        <div className="h-96 lg:h-96 lg:w-96 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden lg:order-2">
          <img
            src={Boy_2}
            alt="Image of a person"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="bg-darkblue-100 rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal mx-4 lg:mx-20 lg:ml-6">
          <div className="mb-8 bg-darkblue-100">
            <div className="text-white text-4xl mb-2 font-norwester">
              PERSONAL <span className="text-70AB0E-800"> TRAINER </span>
            </div>
            <p className="text-white text-xl mt-4 text-justify">
              Our personal training (PT) services provide personalized workout
              and diet plans, guided by certified trainers. We offer nutritional
              advice, supplementation guidance, and 24/7 WhatsApp support.
              Monthly progress checks and flexible scheduling ensure
              convenience. Our services are affordable and health-focused,
              delivering excellent value. We cater to clients with medical
              conditions, ensuring safe and effective fitness journeys. Each
              client receives personalized attention to achieve their fitness
              goals.
            </p>
            <p className="text-white text-xl mt-5 text-justify"></p>
          </div>
        </div>
      </div>
      {/* Card 3 */}
      <div className="flex flex-col items-center justify-center text-center overflow-hidden"> 
  <p className="text-4xl" style={{ fontFamily: "Norwester", letterSpacing: "1px" }}> 
    WHY YOU <span className="text-70AB0E-800">CHOOSE US</span> 
  </p> 
  <p className="text-xl mt-3"> 
    Consulting with fitness professionals and healthcare providers <br /> 
    personalized guidance on your bodybuilding. 
  </p> 
  <EquipmentGrid /> 
</div>

      {/* card 4 */}
      <div className="max-w-sm w-full lg:max-w-full lg:flex justify-center">
        <div className="h-96 lg:h-96 lg:w-96 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden">
          <img
            src={Boy_3}
            alt="Champion"
            className="h-full w-full object-cover"
          />
        </div>

        <div
          className="bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal mx-20 mr-6"
          style={{ maxWidth: "30rem" }}
        >
          <div className="mb-8">
            <div className="text-gray-900 font-bold text-3xl mb-2">
              OUR <span className="text-70AB0E-800">CHAMPIONS</span>
            </div>
            <div className="flex justify-between">
              {champions.map((champion, index) => (
                <div
                  key={index}
                  className="w-1/4 h-11 bg-70AB0E-800 mr-4 flex items-center"
                  style={{
                    clipPath: "polygon(0 0, 95% 0%, 75% 100%, 0% 100%)",
                  }}
                  onClick={() => handleChampionChange(champion)}
                >
                  <p className="mx-7 text-lg">
                    <b>{index + 1}</b>
                  </p>
                </div>
              ))}
            </div>
            <p
              className="text-gray-700 text-xl mt-10"
              style={{ textAlign: "justify" }}
            >
              {currentChampion.text}
              <p className="mt-5"> {currentChampion.sub} </p>
            </p>
          </div>
        </div>
      </div>

      {/* card 5 */}
      <div className="text-center content-center justify-center">
        <p
          className="text-4xl"
          style={{ fontFamily: "Norwester", letterSpacing: "1px" }}
        >
          BEST PROGRAM <span className="text-70AB0E-800">WE OFFER</span>{" "}
        </p>
        <p className="text-lF mt-3 mb-14">
          Consulting with fitness professionals and healthcare provide
          {/* <br /> */}
          personalized guidance on your bodybuilding.
        </p>
      </div>
      <div className="flex flex-col items-left  mb-20">
        <div className="row">
          {/* <div className={` mb-10 border-t-2 border-b-2 border-70AB0E-800 row-item ${expandedRow === 'weightGain' ? 'expanded' : ''}`} onClick={() => handleRowClick('weightGain')}> */}
          <div
            className={`mb-10 border-70AB0E-800 border-t-2 ${
              expandedRow === "weightGain"
                ? "text-70AB0E-800"
                : "text-black-500"
            } border-b-2 row-item ${
              expandedRow === "weightGain" ? "expanded" : ""
            }`}
            onClick={() => handleRowClick("weightGain")}
          >
            <p
              className="row-text text-4xl text-left mx-10 p-5"
              style={{ fontFamily: "Norwester" }}
            >
              WEIGHT GAIN
            </p>
            {expandedRow === "weightGain" && (
              <div className="expanded-content">
                <p className="expanded-text text-black text-black text-sm mx-16 mb-5">
                  Weight gain is an increase in body weight. This can involve an
                  increase in muscle mass, fat deposits, excess fluids such as
                  water or other factors. Weight gain can be a symptom of a
                  serious medical condition.
                </p>
              </div>
            )}
          </div>
          <div
            className={`mb-10 border-t-2 border-b-2 border-70AB0E-800  row-item 
              ${
                expandedRow === "weightLoss"
                  ? "text-70AB0E-800"
                  : "text-black-500"
              } 
              ${expandedRow === "weightLoss" ? "expanded" : ""}`}
            onClick={() => handleRowClick("weightLoss")}
          >
            <p
              className="row-text text-4xl text-left mx-10 p-5"
              style={{ fontFamily: "Norwester" }}
            >
              WEIGHT FIT
            </p>
            {expandedRow === "weightLoss" && (
              <div className="expanded-content">
                <p className="expanded-text text-black text-sm mx-16 mb-5">
                  we give less weight to the less precise measurements and more
                  weight to more precise measurements when estimating the
                  unknown parameters in the model.
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="row">
          <div
            className={`mb-10 border-t-2 border-b-2 border-70AB0E-800 row-item 
              ${
                expandedRow === "normalFit"
                  ? "text-70AB0E-800"
                  : "text-black-500"
              } 
              ${expandedRow === "normalFit" ? "expanded" : ""}`}
            onClick={() => handleRowClick("normalFit")}
          >
            <p
              className="row-text text-4xl text-left mx-10 p-5"
              style={{ fontFamily: "Norwester" }}
            >
              NORMAL FIT
            </p>
            {expandedRow === "normalFit" && (
              <div className="expanded-content">
                <p className="expanded-text text-black text-sm mx-16 mb-5">
                  Muscular strength and endurance: Gym fit individuals have
                  developed their muscles and can perform exercises that require
                  strength and endurance, such as weightlifting, resistance
                  training, or bodyweight exercises.
                </p>
              </div>
            )}
          </div>
          <div
            className={`mb-10 border-t-2 border-b-2 border-70AB0E-800 row-item
              ${
                expandedRow === "crossFit"
                  ? "text-70AB0E-800"
                  : "text-black-500"
              } 
              ${expandedRow === "crossFit" ? "expanded" : ""}`}
            onClick={() => handleRowClick("crossFit")}
          >
            <p
              className="row-text text-4xl text-left mx-10 p-5"
              style={{ fontFamily: "Norwester" }}
            >
              Cross FIT
            </p>
            {expandedRow === "crossFit" && (
              <div className="expanded-content">
                <p className="expanded-text text-black text-sm mx-16 mb-5 w-50">
                  {" "}
                  CrossFit is a unique structured fitness system that focuses on
                  strength and conditioning. It features high-intensity workout
                  that changes every day. A CrossFit session is usually held in
                  a CrossFit gym or a “box”. This is the dedicated place where
                  people who sign up meet for the sessions..{" "}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row ml-2 md:ml-20">
        <div className="md:w-1/2 mt-10 md:mt-20 justify-center">
          <p className="text-4xl">
            <img src={bl} alt="Logo" className="h-24 w-auto" />
          </p>
          <p className="text-xl mt-3 md:w-96">
            Unleash Your Inner Titan at Titans Fitness Gym -
            <br />
            <span className="mt-5 font-bold">
              Where Strength Meets Passion!
            </span>
          </p>
          <button className="rounded-full border border-white bg-70AB0E-800 px-8 mt-5 py-3 text-white">
            Drop a line
          </button>
        </div>

        <div className="md:w-1/2 mt-10 md:mt-20 ml-auto lg:max-w-full lg:flex border-t border-l border-70AB0E-800">
          <div className="max-w-sm w-full lg:max-w-full lg:flex">
            <div className="lg:w-1/2 lg:border-r border-70AB0E-800 lg:border-b-0">
              <div className="flex flex-col p-5">
                <p className="text-sm text-70AB0E-800">CONTACT</p>
                <div className="mt-5">
                  <p>
                    <a href="tel:+918489135973">+91 8489135973</a>
                  </p>
                  <p>
                    <a href="tel:+919043931098">+91 9043931098</a>
                  </p>
                  <p>
                    <a href="mailto:thetitanfitnessstudio@gmail.com">
                      thetitanfitnessstudio@gmail.com
                    </a>
                  </p>
                </div>
                {/* <div className="flex flex-col items-center mt-5">
                  <a
                    href="https://www.codebuilders.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline mb-2"
                  >
                    www.codebuilders.in
                  </a>
                  <div className="flex items-center">
                    <span>Powered by</span>
                    <img
                      src="https://www.codebuilders.in/img/code-builders-logo.svg"
                      alt="Powered by"
                      className="w-20 h-20 ml-2"
                    />
                  </div>
                </div> */}
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="flex flex-col p-5">
                <p className="text-sm text-70AB0E-800 mb-5">FOLLOW US</p>
                <div className="flex items-center space-x-4">
                  <a
                    href="https://www.instagram.com/the_titans_fitness_studio?igsh=MWNmODMwcTFoZDhjdQ%3D%3D&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={insta} alt="Instagram" className="w-10 h-10" />
                  </a>
                  <a
                    href="https://wa.me/919043931098"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={whatsapp} alt="WhatsApp" className="w-10 h-10" />
                  </a>
                  <a
                    href="https://maps.app.goo.gl/bmQFcQ2PV89kd2Px6?g_st=iw"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={loc} alt="Location" className="w-10 h-10" />
                  </a>
                </div>
                <p className="text-black text-lg font-bold mt-5">
                  We accept all major cards and UPI transactions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <img src={cb} alt="Footer Logo" className="w-200 h-20 ml-2 bottom-0" />
    </div>
  );
};

export default HomePage;
