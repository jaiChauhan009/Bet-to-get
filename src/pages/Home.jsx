import React from "react";
import mineThumbnail from "../assets/mineThumbnail.png";
import diceThumbnail from "../assets/diceThumbnail.png";
import hiloThumbnail from "../assets/hiloThumbnail.png";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const Home = () => {
  return (
    <div className="bg-[#1a2c38] h-full pt-8 px-3">
      <Loader></Loader>
      <div className="bg-[#0f212e] max-w-screen-lg m-auto rounded-lg overflow-hidden max-h-[85vh] h-full flex sm:flex-row flex-col items-center justify-evenly">
        <Link
          to="/dice"
          className="rounded-xl overflow-hidden hover:-translate-y-2 cursor-pointer duration-300 sm:w-auto w-36"
        >
          <img src={diceThumbnail}></img>
        </Link>

        <Link
          to="/mines"
          className="rounded-xl overflow-hidden hover:-translate-y-2 cursor-pointer duration-300 sm:w-auto w-36"
        >
          <img src={mineThumbnail}></img>
        </Link>

        <Link
          to="/hilo"
          className="rounded-xl overflow-hidden hover:-translate-y-2 cursor-pointer duration-300 sm:w-auto w-36"
        >
          <img src={hiloThumbnail}></img>
        </Link>
      </div>
    </div>
  );
};

export default Home;
