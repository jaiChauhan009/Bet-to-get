import React, { useState } from "react";
import ruppee from "../assets/ruppee.svg";

const Limbo = () => {
  const [betAmount, setBetAmount] = useState(0.0);

  return (
    <div className="bg-[#1a2c38] h-full pt-8 px-3">
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
                    // disabled={isBetStarted}
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
                      //   disabled={isBetStarted}
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
              <div className="flex flex-col gap-2.5">
                <div className="flex flex-col gap-1">
                  <div className="text-slate-400 text-sm font-medium">
                    <span>Profit on Win</span>
                  </div>
                  <div className="bg-[#2f4553] text-slate-100 px-2 py-1.5 cursor-pointer rounded border-2 text-sm font-medium border-[#2f4553] shadow shadow-slate-800 flex justify-between items-center">
                    <span>0.00</span>
                    <img className="w-4 h-4" src={ruppee} alt="Rs."></img>
                  </div>
                </div>
              </div>
              {/* <div className="flex flex-col gap-1"></div> */}
            </div>
            <button
              //   onClick={handleBetClicked}
              className={`w-full rounded py-3 mt-4 font-semibold bg-[#00e701] hover:bg-[#1fff20] duration-300`}
            >
              Bet
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
                      console.log("x clicked ", showGay);
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
          <div className="md:col-span-3 col-span-4 pb-60 pt-40 relative w-full">
            <h1 className="text-white text-[8rem] font-semibold text-center">
              <span>1.00</span>
              <span className="font-extrabold">&times;</span>
            </h1>
            {/* <div className="grid grid-cols-5 sm:gap-3 gap-1.5 px-1.5">
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
                    src={bombIndices.includes(index) ? bomb : diamond}
                    className={`${visibleImages[index] ? "block" : "hidden"} ${
                      isClickedByUser(index)
                        ? "sm:w-20 sm:h-20 w-10 h-10"
                        : "sm:w-12 sm:h-12 w-6 h-6 opacity-30"
                    }`}
                  />
                </div>
              ))}
            </div> */}
            <div className="absolute bottom-4 right-4 left-4 bg-[#213743] rounded flex p-4 gap-4">
              <div className="flex flex-col gap-2 w-full ">
                <label
                  htmlFor="targetMul"
                  className="text-slate-400 text-sm font-medium"
                >
                  Target Multiplier
                </label>
                <div className="flex bg-[#0f212e] items-center pr-2 border-2 border-[#2f4553] hover:border-[#557086] rounded-md">
                  <input
                    id="targetMul"
                    className="bg-transparent text-slate-100 py-2 rounded-s text-sm font-medium border-2border-slate-600 px-2 focus:outline-none w-full"
                    type="number"
                    defaultValue={(2).toFixed(2)}
                  ></input>
                  <span className="text-slate-300 text-xl font-bold">X</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label className="text-slate-400 text-sm font-medium">
                  Win Percentage
                </label>
                <div className="flex bg-[#0f212e] items-center pr-2 border-2 border-[#2f4553] hover:border-[#557086] rounded-md">
                  <input
                    className="bg-transparent text-slate-100 py-2 rounded-s text-sm font-medium border-2border-slate-600 px-2 focus:outline-none w-full"
                    type="number"
                    defaultValue={2.0}
                  ></input>
                  <span className="text-slate-300 text-xl font-bold">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Limbo;
