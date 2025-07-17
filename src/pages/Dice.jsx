import React, { useEffect, useRef, useState } from "react";
import ruppee from "../assets/ruppee.svg";
import loop from "../assets/roll-over.svg";
import cube from "../assets/cube.svg";
import "./dice.css";
import { getDiceNumber } from "../secure/diceNumber";
import sliderSound from "../assets/tickDrag.mp3";
import winSound from "../assets/winDice.mp3";
import betSound from "../assets/betClick.mp3";
import rollSound from "../assets/rolling.mp3";
import Loader from "../components/Loader";

const Dice = ({ totalAmount, setTotalAmount }) => {
  const [betAmount, setBetAmount] = useState(0.0);
  const [rollValue, setRollValue] = useState(50.5);
  const [mul, setMul] = useState((2).toFixed(4));
  const [isBetStarted, setIsBetStarted] = useState(false);
  const [betResultArray, setBetResultArray] = useState([]);
  const [recentNumber, setRecentNumber] = useState(0);
  const [showDice, setShowDice] = useState(false);
  const diceTimeout = useRef(0);

  const useContainerDimensions = (myRef) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
      const getDimensions = () => ({
        width: myRef.current.offsetWidth,
        height: myRef.current.offsetHeight,
      });

      const handleResize = () => {
        setDimensions(getDimensions());
      };

      if (myRef.current) {
        setDimensions(getDimensions());
      }

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, [myRef]);

    return dimensions;
  };

  const imgRef = useRef();
  const { width, height } = useContainerDimensions(imgRef);

  const sliderAudio = new Audio(sliderSound);
  const winAudio = new Audio(winSound);
  const betAudio = new Audio(betSound);
  const rollAudio = new Audio(rollSound);

  useEffect(() => {
    const slider = document.querySelector(".slider");
    const percentage =
      ((rollValue - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, #e9113c ${percentage}%, #00e701 ${percentage}%)`;
  }, [rollValue]);

  const handleBetClicked = () => {
    if (betAmount > totalAmount) {
      alert("Not Enough Money");
      return;
    }
    betAudio.play();
    const timeoutId = diceTimeout.current;
    clearTimeout(timeoutId);
    setIsBetStarted(true);
    setTimeout(() => {
      rollAudio.play();
    }, 300);
    const timeout1 = setTimeout(() => {
      const diceNumber = getDiceNumber();
      setRecentNumber(diceNumber);
      let newBetResultArray;
      if (diceNumber >= rollValue) {
        setTotalAmount(
          (amt) => parseFloat(amt) + parseFloat((mul - 1) * betAmount)
        );
        newBetResultArray = [
          ...betResultArray,
          { amount: diceNumber, win: true },
        ];
        winAudio.play();
      } else {
        setTotalAmount((amt) => parseFloat(amt) - parseFloat(betAmount));
        newBetResultArray = [
          ...betResultArray,
          { amount: diceNumber, win: false },
        ];
      }
      if (newBetResultArray.length > 5) {
        newBetResultArray = newBetResultArray.slice(-5);
      }
      setBetResultArray(newBetResultArray);
      setShowDice(true);
      setIsBetStarted(false);
    }, 500);

    const timeout2 = setTimeout(() => {
      setShowDice(false);
    }, 4000);
    diceTimeout.current = timeout2;

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  };

  const handleSliderChange = (e) => {
    sliderAudio.play();
    setRollValue(e.target.value);
    setMul(parseFloat(99 / (100 - e.target.value)).toFixed(4));
  };

  return (
    <div className="bg-[#1a2c38] h-full pt-8 px-3">
      <Loader></Loader>
      <div className="bg-[#0f212e] max-w-screen-xl m-auto rounded-lg overflow-hidden max-h-[85vh] h-full">
        <div className="grid grid-cols-4 h-full">
          <div className="md:col-span-1 md:order-first order-last col-span-4 bg-[#213743] py-5 px-3">
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="betAmount"
                  className="text-slate-400 text-sm font-medium w-full"
                >
                  <span>Bet Amount</span>
                </label>
                <div className="bg-[#2f4553] p-0.5 rounded flex">
                  <div className="flex bg-[#0f212e] items-center grow pr-2">
                    <input
                      disabled={isBetStarted}
                      id="betAmount"
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      className="bg-transparent text-slate-100 py-2 rounded-s text-sm font-medium px-2 focus:outline-none w-full"
                    />
                    <img className="w-4 h-4" src={ruppee} alt="Rs."></img>
                  </div>
                  <div className="flex font-semibold text-slate-100 text-sm">
                    <button
                      disabled={isBetStarted}
                      onClick={() =>
                        setBetAmount((amt) => (amt / 2).toFixed(2))
                      }
                      className="w-1/2 hover:bg-[#557086] animate-button-click px-4"
                    >
                      ½
                    </button>
                    <div className="w-0.5 h-5 m-auto bg-[#1a2c38] rounded-full"></div>
                    <button
                      disabled={isBetStarted}
                      onClick={() =>
                        setBetAmount((amt) => (amt * 2).toFixed(2))
                      }
                      className="w-1/2 hover:bg-[#557086] px-4"
                    >
                      2&times;
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="flex flex-col gap-1">
                  <div className="text-slate-400 text-sm font-medium">
                    <span>Profit on Win</span>
                  </div>
                  <div className="bg-[#2f4553] text-slate-100 px-2 py-1.5 cursor-pointer rounded border-2 text-sm font-medium border-[#2f4553] shadow shadow-slate-800 flex justify-between items-center">
                    <span>{parseFloat(betAmount * (mul - 1)).toFixed(2)}</span>
                    <img className="w-4 h-4" src={ruppee} alt="Rs."></img>
                  </div>
                </div>
              </div>
            </div>
            <button
              disabled={isBetStarted}
              onClick={handleBetClicked}
              className={`w-full rounded py-3 mt-4 font-semibold bg-[#00e701] ${
                isBetStarted ? "opacity-50" : "hover:bg-[#1fff20]"
              } duration-300`}
            >
              Bet
            </button>
          </div>
          <div className="md:col-span-3 col-span-4 relative w-full p-2 ">
            <div className="absolute top-4 right-4 flex gap-1 max-w-96 w-fit overflow-x-hidden">
              {betResultArray.map((item, index) => (
                <ShowBetResult
                  key={index}
                  amount={item.amount}
                  win={item.win}
                />
              ))}
            </div>
            <div className="h-full flex">
              <div className="bg-[#2f4553] max-w-screen-md w-full m-auto p-3 sm:p-4 rounded-full relative mb-48 sm:mb-80">
                <div className="absolute text-white font-medium left-6 sm:left-7 -top-7 after:w-2 after:h-2 after:bg-[#2f4553] after:block after:rotate-45 after:mt-[1px]">
                  0
                </div>
                <div className="absolute text-white font-medium left-[25%] ml-2 -top-7 after:w-2 after:h-2 after:bg-[#2f4553] after:block after:rotate-45 after:ml-1 after:mt-[1px]">
                  25
                </div>
                <div className="absolute text-white font-medium left-1/2 -translate-x-1/2 -top-7 after:w-2 after:h-2 after:bg-[#2f4553] after:block after:rotate-45 after:ml-1 after:mt-[1px]">
                  50
                </div>
                <div className="absolute text-white font-medium right-[25%] mr-2 -top-7 after:w-2 after:h-2 after:bg-[#2f4553] after:block after:rotate-45 after:ml-1 after:mt-[1px]">
                  75
                </div>
                <div className="absolute text-white font-medium right-4 -top-7 after:w-2 after:h-2 after:bg-[#2f4553] after:block after:rotate-45 after:ml-1.5 after:mt-[1px]">
                  100
                </div>
                <div className="bg-[#0f212e] flex flex-col justify-center p-3 rounded-full m-auto">
                  <input
                    ref={imgRef}
                    disabled={isBetStarted}
                    onChange={handleSliderChange}
                    type="range"
                    min="2"
                    max="98"
                    defaultValue="50"
                    value={rollValue}
                    className="slider"
                  />
                  <DiceNumber
                    w={width}
                    hidden={!showDice}
                    amount={recentNumber}
                    win={recentNumber >= rollValue}
                  />
                </div>
              </div>
            </div>
            <div className="absolute bottom-4 right-4 left-4 bg-[#213743] rounded flex p-4 gap-2">
              <div className="flex flex-col gap-2 w-full ">
                <label
                  htmlFor="targetMul"
                  className="text-slate-400 text-sm font-medium"
                >
                  Multiplier
                </label>
                <div className="flex bg-[#0f212e] items-center pr-2 border-2 border-[#2f4553] hover:border-[#557086] rounded">
                  <input
                    disabled={isBetStarted}
                    onChange={(e) => {
                      setMul(e.target.value);
                      setRollValue(100 - 99 / e.target.value);
                    }}
                    id="targetMul"
                    className="bg-transparent text-slate-100 py-2 rounded-s text-sm font-medium px-2 focus:outline-none w-full"
                    type="number"
                    value={mul}
                  />
                  <span className="text-[#b1bad3] text-lg font-bold">X</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full ">
                <label
                  htmlFor="roll"
                  className="text-slate-400 text-sm font-medium"
                >
                  Roll Over
                </label>
                <div className="flex bg-[#0f212e] items-center pr-2 border-2 border-[#2f4553] hover:border-[#557086] rounded">
                  <input
                    disabled
                    id="roll"
                    className="bg-transparent text-slate-100 py-2 rounded-s text-sm font-medium px-2 focus:outline-none w-full cursor-pointer"
                    type="number"
                    value={parseFloat(rollValue).toFixed(2)}
                  />
                  <img className="w-5" src={loop} alt="" />
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label className="text-slate-400 text-sm font-medium">
                  Win Percentage
                </label>
                <div className="flex bg-[#0f212e] items-center pr-2 border-2 border-[#2f4553] hover:border-[#557086] rounded">
                  <input
                    disabled
                    className="bg-transparent text-slate-100 py-2 rounded-s text-sm font-medium px-2 focus:outline-none w-full cursor-pointer"
                    type="number"
                    value={parseFloat(100 - rollValue).toFixed(4)}
                  />
                  <span className="text-[#b1bad3] text-lg font-bold">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShowBetResult = ({ amount, win }) => {
  return (
    <div
      className={`px-4 py-2 font-bold text-xs rounded-full betResult animate slide ${
        win ? "bg-[#00e701] text-black" : "bg-[#2f4553] text-white"
      }`}
    >
      {parseFloat(amount).toFixed(2)}
    </div>
  );
};

const DiceNumber = ({ w, amount, win, hidden }) => {
  return (
    <div
      style={{ left: `${(amount * w) / 100 - 5}px` }}
      className={`absolute transform transition-all duration-300 ${
        hidden ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative">
        <img
          className="w-[4.2rem] sm:w-20 mb-[4.8rem] sm:mb-[5.5rem] h-fit"
          src={cube}
          alt=""
        />
        <span
          className={`absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 ${
            win ? "text-[#00b801]" : "text-[#ea234b]"
          } text sm:text-lg font-bold`}
        >
          {parseFloat(amount).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default Dice;
