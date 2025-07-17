import React, { useState, useCallback, useEffect, useRef } from "react";
import gem from "../assets/gem.svg";
import bomb2 from "../assets/bomb2.svg";
import "./style.css";
import Popup from "../components/Popup";
import ruppee from "../assets/ruppee.svg";
import { calculatePayout } from "../secure/payoutCalc";
import LostPopup from "../components/LostPopup";
import clickSound from "../assets/audio-mines-2.mp3";
// import bombSound from "../assets/audio-bomb-2.mp3";
import Loader from "../components/Loader";

const Mine = ({ totalAmount, setTotalAmount }) => {
  const totalCells = 25;
  const array = Array.from({ length: 24 }, (_, i) => i + 1);
  const [visibleImages, setVisibleImages] = useState(
    Array(totalCells).fill(false)
  );
  const [bombIndices, setBombIndices] = useState([]);
  const [clickedIndices, setClickedIndices] = useState([]);
  const [firstBombClicked, setFirstBombClicked] = useState(false);
  const [noOfBombs, setNoOfBombs] = useState(3);
  const [isBetStarted, setIsBetStarted] = useState(false);
  const [showPop, setShowPop] = useState(false);
  const [showLostPop, setShowLostPop] = useState(false);
  const score = useRef(0);
  const [betAmount, setBetAmount] = useState(0.0);
  const [profitRatio, setProfitRatio] = useState(1.0);
  const [totalProfit, setTotalProfit] = useState(0.0);
  const [sentBet, setSentBet] = useState(0.0);
  const clickAudioRef = useRef(null);
  // const bombAudioRef = useRef(null);
  // const [gay, setGay] = useState(false);
  // const [showGay, setShowGay] = useState(false);

  useEffect(() => {
    if (firstBombClicked) {
      // setTotalProfit(0.0);
      // setProfitRatio(1.0);
      setShowLostPop(true);
      setIsBetStarted(false);
    }
  }, [firstBombClicked]);

  const animationEffect = (e) => {
    e.target.classList.add("animate-click");
    setTimeout(() => {
      e.target.classList.remove("animate-click");
    }, 600);
  };

  const reset = () => {
    setTotalProfit(0.0);
    setProfitRatio(1.0);
    setShowLostPop(false);
    setShowPop(false);
    setVisibleImages(Array(totalCells).fill(false));
    setClickedIndices([]);
    setFirstBombClicked(false);
    setShowPop(false);
    score.current = 0;
  };

  const handleBetClicked = () => {
    if (isBetStarted) {
      setSentBet(parseFloat(betAmount) + parseFloat(totalProfit));
      setShowPop(true);
      setIsBetStarted(false);
      setVisibleImages(Array(totalCells).fill(true));
      setTotalAmount(
        (amt) =>
          parseFloat(amt) + parseFloat(betAmount) + parseFloat(totalProfit)
      );
      return;
    }
    if (betAmount > totalAmount) {
      alert("Not Enough Money");
      return;
    }
    reset();
    setTotalAmount((amt) => parseFloat(amt) - parseFloat(betAmount));
    const randomBombIndices = getRandomIndices(noOfBombs);
    setBombIndices(randomBombIndices);
    // console.log(randomBombIndices);
    setTimeout(() => setIsBetStarted(true), 500);
  };

  const handleClick = useCallback(
    (e, index) => {
      if (!isBetStarted || firstBombClicked || visibleImages[index]) {
        return;
      }
      animationEffect(e);
      setTimeout(() => {
        if (bombIndices.includes(index)) {
          // bombAudioRef.current.play();
          setClickedIndices((prev) => [...prev, index]);
          setFirstBombClicked(true);
          setVisibleImages(Array(totalCells).fill(true));
        } else {
          clickAudioRef.current.play();
          const payout = calculatePayout(
            betAmount,
            25,
            noOfBombs,
            score.current + 1,
            1
          );
          setProfitRatio((payout / betAmount).toFixed(2));
          setTotalProfit(payout - betAmount);
          setVisibleImages((prev) => {
            const newVisibleImages = [...prev];
            newVisibleImages[index] = true;
            return newVisibleImages;
          });
          if (noOfBombs + clickedIndices.length + 1 == 25) {
            setSentBet(parseFloat(payout));
            setIsBetStarted(false);
            setShowPop(true);
            // console.log(
            //   parseFloat(totalAmount),
            //   parseFloat(betAmount),
            //   parseFloat(payout - betAmount)
            // );
            setTotalAmount((amt) => parseFloat(amt) + parseFloat(payout));
          }

          setClickedIndices((prev) => [...prev, index]);
          score.current = score.current + 1;
        }
      }, 750);
    },
    [isBetStarted, firstBombClicked, visibleImages, bombIndices]
  );

  const isClickedByUser = (index) => clickedIndices.includes(index);

  const getRandomIndices = (k, n = totalCells) => {
    if (k < 1 || k >= n) {
      throw new Error("k must be between 1 and n-1 inclusive");
    }
    const indices = Array.from({ length: n }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices.slice(0, k);
  };

  return (
    <div className="bg-[#1a2c38] h-full pt-8 px-3">
      <Loader></Loader>

      <div className="bg-[#0f212e] max-w-screen-xl m-auto rounded-lg overflow-hidden">
        <div className="grid grid-cols-4">
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
                  <input
                    disabled={isBetStarted}
                    id="betAmount"
                    type="number"
                    defaultValue={0.0}
                    value={betAmount}
                    onChange={(e) => {
                      setBetAmount(e.target.value);
                    }}
                    className="bg-[#0f212e] text-slate-100 py-2 rounded-s text-sm font-medium border-2border-slate-600 px-2 focus:outline-none"
                  />
                  <div className="w-full flex font-semibold text-slate-100 text-sm">
                    <button
                      disabled={isBetStarted}
                      onClick={() => {
                        setBetAmount((amt) => {
                          return (amt / 2).toFixed(2);
                        });
                      }}
                      className="w-1/2 hover:bg-[#557086] animate-button-click"
                    >
                      ½
                    </button>
                    <div className="w-0.5 h-5 m-auto bg-[#1a2c38] rounded-full"></div>
                    <button
                      disabled={isBetStarted}
                      onClick={() => {
                        setBetAmount((amt) => {
                          return (amt * 2).toFixed(2);
                        });
                      }}
                      className="w-1/2 hover:bg-[#557086]"
                    >
                      2&times;
                    </button>
                  </div>
                </div>
              </div>
              {isBetStarted ? (
                <div className="flex flex-col gap-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <div className="text-slate-400 text-sm font-medium">
                        Mines
                      </div>
                      <div className="bg-[#2f4553] text-slate-100 px-2 py-1.5 cursor-pointer rounded border-2 text-sm font-medium border-[#2f4553] shadow shadow-slate-800">
                        <span>{noOfBombs}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-slate-400 text-sm font-medium">
                        Gems
                      </div>
                      <div className="bg-[#2f4553] text-slate-100 px-2 py-1.5 cursor-pointer rounded border-2 text-sm font-medium border-[#2f4553] shadow shadow-slate-800 ">
                        <span>{25 - noOfBombs - score.current}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-slate-400 text-sm font-medium">
                      <span>Total Profit </span>
                      <span>({profitRatio}&times;)</span>
                    </div>
                    <div className="bg-[#2f4553] text-slate-100 px-2 py-1.5 cursor-pointer rounded border-2 text-sm font-medium border-[#2f4553] shadow shadow-slate-800 flex justify-between items-center">
                      <span>{totalProfit.toFixed(2)}</span>
                      <img className="w-4 h-4" src={ruppee} alt="Rs."></img>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="minesNo"
                    className="text-slate-400 text-sm font-medium"
                  >
                    Mines
                  </label>
                  <select
                    id="minesNo"
                    name="minesNo"
                    value={noOfBombs}
                    disabled={isBetStarted}
                    onChange={(e) => setNoOfBombs(parseInt(e.target.value))}
                    className="bg-[#0f212e] text-slate-100 p-1 py-1.5 cursor-pointer rounded border-2 text-sm font-medium border-slate-600"
                  >
                    {array.map((no) => (
                      <option key={no} value={no}>
                        {no}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <button
              onClick={handleBetClicked}
              className={`w-full rounded py-3 mt-4 font-semibold bg-[#00e701] hover:bg-[#1fff20] duration-300`}
            >
              {isBetStarted ? "Cashout" : "Bet"}
            </button>
            {/* <div className="text-blue-500 text-sm mt-3 cursor-pointer">
              <span
                onClick={() => {
                  setShowGay(true);
                }}
              >
                Paise Chahiye?
              </span>
              <div
                hidden={!showGay}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 border-blue-500 border-4 rounded-xl bg-[#10242f] "
              >
                <div className="rounded-xl p-5">
                  <button
                    onClick={() => {
                      setShowGay(false);
                      // console.log("x clicked ", showGay);
                    }}
                    className="absolute w-5 h-5 pb-0.5 top-2 right-2 bg-slate-700 rounded-full text-slate-200 flex justify-center items-center z-50"
                  >
                    &times;
                  </button>
                  <h1 className="text-xl font-semibold w-full text-center mb-3">
                    For &#8377;20,000
                  </h1>
                  <div class="flex items-center">
                    <input
                      id="link-checkbox"
                      type="checkbox"
                      onChange={(e) => {
                        setGay(e.target.checked);
                      }}
                      value="true"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label
                      for="link-checkbox"
                      class="ms-2 font-medium text-slate-300"
                    >
                      I agree that I'm{" "}
                      <span class="text-blue-600 dark:text-blue-500">
                        GAY (Chhakka)
                      </span>
                    </label>
                  </div>
                  <button
                    onClick={() => {
                      if (totalAmount <= 20000) {
                        setTotalAmount((amt) => parseFloat(amt) + 20000);
                      } else {
                        alert("BKL, Itne Paise GAND me Bharega");
                      }
                      setShowGay(false);
                    }}
                    disabled={!gay}
                    className={`w-full rounded py-3 mt-4 font-semibold bg-blue-600 ${
                      gay ? " hover:bg-blue-500" : "opacity-25"
                    } duration-300 text-slate-200`}
                  >
                    Claim
                  </button>
                </div>
              </div>
            </div> */}
          </div>
          <div className="md:col-span-3 col-span-4 m-auto sm:py-3 py-1.5 relative w-full xs:w-fit">
            <Popup
              hidden={!showPop}
              profitRatio={profitRatio}
              totalWin={parseFloat(sentBet).toFixed(2)}
            />
            <LostPopup hidden={!showLostPop}></LostPopup>

            <div className="grid grid-cols-5 sm:gap-3 gap-1.5 px-1.5">
              {Array.from({ length: totalCells }).map((_, index) => (
                <div
                  key={index}
                  onClick={(e) => handleClick(e, index)}
                  className={`sm:w-[6.5rem] sm:h-28 w-auto h-[4.1rem] xs:w-[4.4rem] xs:h-[4.5rem] ${
                    visibleImages[index]
                      ? "bg-[#071822]"
                      : "cursor-pointer bg-[#2f4553] hover:bg-[#557086] hover:-translate-y-1 sm:border-b-[8px] border-b-4 border-[#213743]"
                  } rounded-lg ease-in-out duration-300 flex justify-center items-center`}
                >
                  <img
                    src={bombIndices.includes(index) ? bomb2 : gem}
                    className={`${visibleImages[index] ? "block" : "hidden"} ${
                      isClickedByUser(index)
                        ? "sm:w-20 sm:h-20 w-10 h-10"
                        : "sm:w-12 sm:h-12 w-6 h-6 opacity-30"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <audio ref={clickAudioRef} src={clickSound} />
      {/* <audio ref={bombAudioRef} src={bombSound} /> */}
    </div>
  );
};

export default Mine;
