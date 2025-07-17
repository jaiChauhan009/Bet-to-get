import React, { useEffect, useRef, useState } from "react";
import "./hilo.css";
import ruppee from "../assets/ruppee.svg";
import Loader from "../components/Loader";
// import bgHi from "../assets/bgHi.svg";
// import bgHiStacked from "../assets/bgHiStacked.svg";
// import bgLo from "../assets/bgLo.svg";
// import bgLoStacked from "../assets/bgLoStacked.svg";
// import higherButton from "../assets/higherButton.svg";
// import lowerButton from "../assets/lowerButton.svg";
import clubs from "../assets/clubs.svg";
import hearts from "../assets/hearts.svg";
import spades from "../assets/spades.svg";
import diamonds from "../assets/diamonds.svg";
import { generateCard } from "../secure/hiloLogic";
import Popup from "../components/Popup";

const HiLo = ({ totalAmount, setTotalAmount }) => {
  const [betAmount, setBetAmount] = useState(0.0);
  const [currentCard, setCurrentCard] = useState(generateCard());
  const [isBetStarted, setIsBetStarted] = useState(false);
  const [recentCardsArray, setRecentCardsArray] = useState([
    {
      card: currentCard,
      desc: "Start Card",
      isLost: false,
    },
  ]);
  const [nextCard, setNextCard] = useState(generateCard());
  const [totalProfitMul, setTotalProfitMul] = useState(1.0);
  const [controlOpacity, setControlOpacity] = useState(false);
  const [lost, setLost] = useState(false);
  const [showPop, setShowPop] = useState(false);

  const cardRef = useRef();

  const handleBetClicked = () => {
    if (betAmount > totalAmount) {
      alert("Not Enough Money");
      return;
    }
    setTotalAmount((amt) => parseFloat(amt) - parseFloat(betAmount));
    if (isBetStarted) {
      // cashout
      console.log("Cashout -", totalProfitMul, totalProfitMul * betAmount);
      setTotalAmount(
        (amt) =>
          parseFloat(amt) +
          parseFloat(totalProfitMul * betAmount) +
          parseFloat(betAmount)
      );
      setShowPop(true);
      setIsBetStarted(false);
      return;
    }
    setIsBetStarted(true);
    setControlOpacity(true);
    resetThings();

    // const timeout1 = setTimeout(() => {
    //   setIsBetStarted(false);
    // }, 500);

    // return () => {
    //   clearTimeout(timeout1);
    // };
  };

  const resetThings = () => {
    setRecentCardsArray([
      {
        card: currentCard,
        desc: "Start Card",
        isLost: false,
      },
    ]);
    setTotalProfitMul(1.0);
    setLost(false);
    setShowPop(false);
  };

  const addAnimation = () => {
    console.log(
      cardRef.current.classList,
      "\n",
      cardRef.current.classList.contains("flick")
    );
    if (cardRef.current.classList.contains("flick")) {
      cardRef.current.classList.remove("flick");
      cardRef.current.classList.add("flick2");
    } else {
      cardRef.current.classList.remove("flick2");
      cardRef.current.classList.add("flick");
    }

    // setTimeout(() => {
    //   cardRef.current.classList.remove("flick");
    //   cardRef.current.classList.remove("flick2");
    // }, 500);
  };

  const handleSkip = (ArrDesc, isLost, isHigher) => {
    const randomCard = generateCard();
    addAnimation();
    setTimeout(() => {
      setCurrentCard(nextCard);
      setNextCard(randomCard);
      if (isBetStarted) {
        setRecentCardsArray([
          ...recentCardsArray,
          {
            card: nextCard,
            desc: `${
              isNaN(parseFloat(ArrDesc).toFixed(2))
                ? parseFloat(totalProfitMul).toFixed(2)
                : parseFloat(ArrDesc).toFixed(2)
            }x`,
            isLost,
            isSkipped: isNaN(parseFloat(ArrDesc).toFixed(2)),
            isHigher,
          },
        ]);
        var elem = document.getElementById("dataScroll");
        elem.scrollLeft = elem.scrollWidth;
      } else {
        setLost(false);
        setRecentCardsArray([
          {
            card: nextCard,
            desc: "Start Card",
            isLost,
          },
        ]);
      }
    }, 300);
  };

  const handleHigher = () => {
    if (currentCard.cardNumber == 1 && nextCard.cardNumber == 1) {
      console.log(
        "You Lose",
        "current =" + currentCard.cardNumber,
        "next =" + nextCard.cardNumber
      );
      handleSkip(0.0, true, true);
      setTimeout(() => {
        setLost(true);
      }, 300);
      setIsBetStarted(false);
      setControlOpacity(false);
      return;
    }
    setControlOpacity(true);

    if (currentCard.cardNumber <= nextCard.cardNumber) {
      const mul =
        currentCard.cardNumber == 1
          ? 1.07
          : parseFloat((13 / (14 - currentCard.cardNumber)) * 0.99).toFixed(2);

      if (totalProfitMul == 1) {
        handleSkip(totalProfitMul * mul, false, true);
      } else {
        handleSkip((totalProfitMul * mul) / 0.99, false, true);
      }

      setTotalProfitMul((totalmul) => {
        if (totalmul == 1) {
          return (totalmul * mul).toFixed(2);
        } else {
          return ((totalmul * mul) / 0.99).toFixed(2);
        }
      });

      console.log(
        "You won and its Higher or Same ",
        "totalMul =" + totalProfitMul,
        "mul =" + mul
      );

      setControlOpacity(false);
      // same
    } else {
      console.log(
        "You Lose",
        "current =" + currentCard.cardNumber,
        "next =" + nextCard.cardNumber
      );
      handleSkip(0.0, true, true);
      setTimeout(() => {
        setLost(true);
      }, 300);
      setIsBetStarted(false);
      setControlOpacity(false);
    }
  };

  const handleLower = () => {
    setControlOpacity(true);
    if (currentCard.cardNumber == 13 && nextCard.cardNumber == 13) {
      console.log(
        "You Lose",
        "current =" + currentCard.cardNumber,
        "next =" + nextCard.cardNumber
      );
      handleSkip(0.0, true, false);
      setTimeout(() => {
        setLost(true);
      }, 300);
      setIsBetStarted(false);
      setControlOpacity(false);
      return;
    }
    if (currentCard.cardNumber >= nextCard.cardNumber) {
      const mul =
        currentCard.cardNumber == 13
          ? 1.07
          : parseFloat((13 / currentCard.cardNumber) * 0.99).toFixed(2);

      if (totalProfitMul == 1) {
        handleSkip(totalProfitMul * mul, false, false);
      } else {
        handleSkip((totalProfitMul * mul) / 0.99, false, false);
      }

      setTotalProfitMul((totalmul) => {
        if (totalmul == 1) {
          return totalmul * mul;
        } else {
          return (totalmul * mul) / 0.99;
        }
      });
      console.log(
        "You won and its Lower or Same  ",
        "totalMul =" + totalProfitMul,
        "mul =" + mul
      );

      setControlOpacity(false);
      // same
    } else {
      console.log(
        "You Lose",
        "current =" + currentCard.cardNumber,
        "next =" + nextCard.cardNumber
      );
      setTimeout(() => {
        setLost(true);
      }, 300);
      handleSkip(0.0, true, false);
      setIsBetStarted(false);
      setControlOpacity(false);
    }
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
              <div className="sm:flex flex-col gap-2.5 hidden">
                <button
                  disabled={!isBetStarted}
                  onClick={handleHigher}
                  className="bg-[#2f4553] text-slate-100 px-2 py-3.5 rounded text-sm font-medium shadow shadow-slate-800 flex justify-center items-center gap-2 hover:bg-[#557086] disabled:opacity-50 disabled:hover:bg-[#2f4553]"
                >
                  <span>
                    {currentCard.cardNumber == 13 ? "" : "Higher"}{" "}
                    {currentCard.cardNumber > 1 && currentCard.cardNumber < 13
                      ? " or "
                      : " "}
                    {currentCard.cardNumber == 1 ? "" : "Same"}
                  </span>
                  {currentCard.cardNumber != 13 ? (
                    <svg
                      fill="currentColor"
                      viewBox="0 0 64 64"
                      class="svg-icon text-[#ffce00] w-4"
                    >
                      <path d="M32.271 17 9.201 40.071 16.128 47l16.145-16.145L48.418 47l6.93-6.929L32.275 17h-.005Z"></path>
                    </svg>
                  ) : (
                    <svg
                      fill="currentColor"
                      viewBox="0 0 64 64"
                      class="svg-icon text-[#ffce00] w-3.5 mt-0.5"
                    >
                      <path d="M0 15.365h64v11.428H0V15.365Zm0 21.842h64v11.428H0V37.207Z"></path>
                    </svg>
                  )}

                  <span className="font-semibold">
                    {currentCard.cardNumber == 1
                      ? 92.31
                      : parseFloat(
                          ((14 - currentCard.cardNumber) * 100) / 13
                        ).toFixed(2)}
                    %
                  </span>
                </button>
                <button
                  disabled={!isBetStarted}
                  onClick={handleLower}
                  className="bg-[#2f4553] text-slate-100 px-2 py-3.5 rounded text-sm font-medium shadow shadow-slate-800 flex justify-center items-center gap-2 hover:bg-[#557086] disabled:opacity-50 disabled:hover:bg-[#2f4553]"
                >
                  <span>
                    {currentCard.cardNumber == 1 ? "" : "Lower"}
                    {currentCard.cardNumber > 1 && currentCard.cardNumber < 13
                      ? " or "
                      : " "}
                    {currentCard.cardNumber == 13 ? "" : "Same"}
                  </span>
                  {currentCard.cardNumber == 1 ? (
                    <svg
                      fill="currentColor"
                      viewBox="0 0 64 64"
                      class="svg-icon text-[#7F47FD] w-3.5 mt-0.5"
                    >
                      <path d="M0 15.365h64v11.428H0V15.365Zm0 21.842h64v11.428H0V37.207Z"></path>
                    </svg>
                  ) : (
                    <svg
                      fill="currentColor"
                      viewBox="0 0 64 64"
                      class="svg-icon text-[#7F47FD] w-4"
                    >
                      <path d="M32.271 49.763 9.201 26.692l6.928-6.93 16.145 16.145 16.144-16.144 6.93 6.929-23.072 23.07h-.005Z"></path>
                    </svg>
                  )}

                  <span className="font-semibold">
                    {currentCard.cardNumber == 13
                      ? 92.31
                      : parseFloat((currentCard.cardNumber * 100) / 13).toFixed(
                          2
                        )}
                    %
                  </span>
                </button>
                <button
                  onClick={handleSkip}
                  className="bg-[#2f4553] text-slate-100 px-2 py-3 rounded text-sm font-medium shadow shadow-slate-800 flex justify-center items-center gap-2 hover:bg-[#557086] disabled:opacity-50 disabled:hover:bg-[#2f4553] duration-150"
                >
                  <span>Skip Card</span>
                  <svg
                    fill="currentColor"
                    viewBox="0 0 64 64"
                    class="svg-icon w-3.5 mt-0.5"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="m0 49.74 7.793 7.794L33.328 32 7.793 6.466 0 14.259 17.74 32 0 49.74Zm30.672 0 7.793 7.794L64 32 38.465 6.466l-7.793 7.793L48.412 32 30.673 49.74Z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <button
              disabled={controlOpacity}
              onClick={handleBetClicked}
              className={`w-full rounded py-3.5 mt-4 font-semibold bg-[#00e701] ${
                controlOpacity ? "opacity-50" : "hover:bg-[#1fff20]"
              } duration-300`}
            >
              {isBetStarted ? "Cashout" : "Bet"}
            </button>
          </div>
          <div className="md:col-span-3 col-span-4 w-full p-2 flex flex-col relative">
            <Popup
              hidden={!showPop}
              profitRatio={parseFloat(totalProfitMul).toFixed(2)}
              totalWin={parseFloat(totalProfitMul * betAmount).toFixed(2)}
            />
            <div className="grow flex justify-center items-center relative my-2">
              <div className="bg-white shadow-md w-fit rounded-md pb-1">
                <div className="bgwhite shadow-md w-fit rounded-md pb-1">
                  <div className="bg-white shadow-md w-fit rounded-md pb-1">
                    <div className="bg-white shadow-md w-fit rounded-md pb-1 relative">
                      <div className="absolute inset-0 z-0">
                        <CardBack lost={lost} />
                      </div>
                      <div className="bg-transparent shadow-md w-fit rounded-md pb-1 relative">
                        <button
                          onClick={handleSkip}
                          className="bg-[#2f4553] w-fit absolute -top-5 -left-5 sm:right-[-1.25rem] sm:left-auto py-3 px-4 rounded shadow-md z-10 sm:hover:bg-[#557086] disabled:opacity-50 disabled:hover:bg-[#2f4553] duration-150 active:bg-[#557086]"
                        >
                          <svg
                            fill="white"
                            viewBox="0 0 64 64"
                            class="svg-icon w-3.5 mt-0.5"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="m0 49.74 7.793 7.794L33.328 32 7.793 6.466 0 14.259 17.74 32 0 49.74Zm30.672 0 7.793 7.794L64 32 38.465 6.466l-7.793 7.793L48.412 32 30.673 49.74Z"
                            ></path>
                          </svg>
                        </button>
                        <Card
                          lost={lost}
                          card={currentCard}
                          cardRef={cardRef}
                        ></Card>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center gap-3 ml-5 z-10 sm:hidden">
                <button
                  disabled={!isBetStarted}
                  onClick={handleHigher}
                  className="bg-higherButton bg-no-repeat bg-auto w-[112px] h-[126.74px] flex flex-col text-[#453800] font-bold justify-center items-center disabled:opacity-50 active:opacity-75"
                  // style={{ backgroundImage: `url(${higherButton})` }}
                >
                  <span className="w-20 mt-5">
                    {currentCard.cardNumber == 13 ? "" : "Higher"}{" "}
                    {currentCard.cardNumber > 1 && currentCard.cardNumber < 13
                      ? " or "
                      : " "}
                    {currentCard.cardNumber == 1 ? "" : "Same"}
                  </span>
                  <span className="">
                    {currentCard.cardNumber == 1
                      ? 92.31
                      : parseFloat(
                          ((14 - currentCard.cardNumber) * 100) / 13
                        ).toFixed(2)}
                    %
                  </span>
                </button>
                <button
                  disabled={!isBetStarted}
                  onClick={handleLower}
                  className="bg-lowerButton bg-no-repeat bg-auto w-[112px] h-[126.74px] flex flex-col text-white font-bold justify-center items-center disabled:opacity-50 active:opacity-75"
                  // style={{ backgroundImage: `url(${lowerButton})` }}
                >
                  <span className="w-20 -mt-5">
                    {currentCard.cardNumber == 1 ? "" : "Lower"}
                    {currentCard.cardNumber > 1 && currentCard.cardNumber < 13
                      ? " or "
                      : " "}
                    {currentCard.cardNumber == 13 ? "" : "Same"}
                  </span>

                  <span className="">
                    {currentCard.cardNumber == 13
                      ? 92.31
                      : parseFloat((currentCard.cardNumber * 100) / 13).toFixed(
                          2
                        )}
                    %
                  </span>
                </button>
              </div>

              {/* <Card small></Card> */}
              <div
                className="absolute top-0 left-20 right-0 bottom-0 bg-bgHi bg-left bg-no-repeat sm:block hidden"
                // style={{ backgroundImage: `url(${bgHi})` }}
              />
              <div
                className="absolute top-0 right-20 left-0 bottom-0 bg-bgLo bg-right bg-no-repeat sm:block hidden"
                // style={{ backgroundImage: `url(${bgLo})` }}
              />
              <div
                className="absolute top-0 left-2 right-0 bottom-0 bg-bgHiStacked bg-left bg-no-repeat block sm:hidden"
                // style={{ backgroundImage: `url(${bgHiStacked})` }}
              />
              <div
                className="absolute top-0 right-2 left-0 bottom-0 bg-bgLoStacked bg-right bg-no-repeat block sm:hidden"
                // style={{ backgroundImage: `url(${bgLoStacked})` }}
              />
            </div>
            <div className="m-2 flex flex-col gap-2">
              <div className=" bg-[#213743] rounded flex p-4 gap-4">
                <div className="sm:flex flex-col gap-2 w-full hidden">
                  <label
                    htmlFor="targetMul"
                    className="text-slate-400 text-sm font-semibold"
                  >
                    Profit Higher{" "}
                    <span>
                      (
                      {currentCard.cardNumber == 1
                        ? 1.07
                        : parseFloat(
                            (13 / (14 - currentCard.cardNumber)) * 0.99
                          ).toFixed(2)}
                      <span className="font-extrabold">&times;</span>)
                    </span>
                  </label>
                  <div className="flex bg-[#2f4553] items-center pr-2 border-2 border-[#2f4553] hover:border-[#557086] rounded shadow shadow-slate-800 ">
                    <svg
                      fill="currentColor"
                      viewBox="0 0 64 64"
                      class="svg-icon text-[#b1bad3] w-5 ml-2"
                    >
                      <path d="M64 32.8 32 .8l-32 32h16.234v30.4H47.78V32.8H64Z"></path>
                    </svg>
                    <input
                      disabled
                      value={(
                        betAmount *
                        (currentCard.cardNumber == 1
                          ? 0.07
                          : parseFloat(
                              (13 / (14 - currentCard.cardNumber)) * 0.99
                            ) - 1)
                      ).toFixed(2)}
                      id="targetMul"
                      className="bg-transparent text-slate-100 py-2 rounded-s text-sm font-medium px-2 focus:outline-none w-full cursor-text"
                      type="number"
                    />
                    {/* <span className="text-[#b1bad3] text-lg font-bold">X</span> */}
                    <img className="w-4" src={ruppee} alt="" />
                  </div>
                </div>
                <div className="sm:flex flex-col gap-2 w-full hidden">
                  <label
                    htmlFor="roll"
                    className="text-slate-400 text-sm font-medium"
                  >
                    Profit Lower{" "}
                    <span>
                      (
                      {currentCard.cardNumber == 13
                        ? 1.07
                        : parseFloat(
                            (13 / currentCard.cardNumber) * 0.99
                          ).toFixed(2)}
                      <span className="font-extrabold">&times;</span>)
                    </span>
                  </label>
                  <div className="flex bg-[#2f4553] items-center pr-2 border-2 border-[#2f4553] hover:border-[#557086] rounded shadow shadow-slate-800">
                    <svg
                      fill="currentColor"
                      viewBox="0 0 64 64"
                      class="svg-icon text-[#b1bad3] w-5 ml-2"
                    >
                      <path d="m0 31.199 32 32 32-32H47.78V.8H16.234v30.398H0Z"></path>
                    </svg>
                    <input
                      disabled
                      value={(
                        betAmount *
                        (currentCard.cardNumber == 13
                          ? 0.07
                          : parseFloat((13 / currentCard.cardNumber) * 0.99) -
                            1)
                      ).toFixed(2)}
                      id="roll"
                      className="bg-transparent text-slate-100 py-2 rounded-s text-sm font-medium px-2 focus:outline-none w-full cursor-text"
                      type="number"
                    />
                    {/* <img className="w-5" src={loop} alt="" /> */}
                    <img className="w-4" src={ruppee} alt="" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full ">
                  <label className="text-slate-400 text-sm font-medium">
                    Total Profit{" "}
                    <span>
                      ({parseFloat(totalProfitMul).toFixed(2)}
                      <span className="font-extrabold">&times;</span>)
                    </span>
                  </label>
                  <div className="flex bg-[#2f4553] items-center pr-2 border-2 border-[#2f4553] hover:border-[#557086] rounded shadow shadow-slate-800">
                    <input
                      disabled
                      value={parseFloat(totalProfitMul * betAmount).toFixed(2)}
                      className="bg-transparent text-slate-100 py-2 rounded-s text-sm font-medium px-2 focus:outline-none w-full cursor-text"
                      type="number"
                    />
                    <img className="w-4" src={ruppee} alt="" />
                  </div>
                </div>
              </div>
              <div
                id="dataScroll"
                className="bg-[#0b1922] rounded p-2 overflow-x-scroll flex w-full sm:gap-2 gap-[0.15rem] no-scroll "
              >
                {recentCardsArray.map((item, index) => {
                  console.log(item.isSkipped);
                  return (
                    <div className="w-fit flex flex-col gap-0.5 travel items-center relative">
                      <div
                        hidden={index == 0}
                        className=" bg-white h-fit w-fit p-2 rounded-md shadow shadow-slate-400 absolute top-2 sm:top-12 -left-4 sm:-left-5 z-20"
                      >
                        {item.isSkipped ? (
                          <svg
                            fill="#ff9d00"
                            viewBox="0 0 64 64"
                            class="svg-icon w-3 sm:w-4"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="m0 49.74 7.793 7.794L33.328 32 7.793 6.466 0 14.259 17.74 32 0 49.74Zm30.672 0 7.793 7.794L64 32 38.465 6.466l-7.793 7.793L48.412 32 30.673 49.74Z"
                            ></path>
                          </svg>
                        ) : (
                          // "jojo"
                          <svg
                            fill={`${item.isLost ? "#e9113c" : "#00e701"}`}
                            viewBox="0 0 64 64"
                            class={`svg-icon w-3 sm:w-4 ${
                              item.isHigher ? "rotate-180" : ""
                            }`}
                          >
                            <path d="m32 47.377 24-24 8 8-32 32-32-32 8-8 24 24ZM.322.621h63.356v11.313H.322V.622Z"></path>
                          </svg>
                        )}
                      </div>
                      <div className="">
                        {/* <div className="absolute bg-white rounded">
                          <CardBack small></CardBack>
                        </div> */}
                        <Card
                          isSkipped={item.isSkipped}
                          small
                          card={item.card}
                        ></Card>
                      </div>
                      <div
                        className={`sm:text-sm text-[0.70rem]  ${
                          item.isLost
                            ? "bg-[#e9113c] text-[#2f030c]"
                            : "bg-[#00e701] text-[#013e01]"
                        } w-full rounded-sm py-0.5 px-1 sm:font-semibold font-bold text-center cursor-default`}
                      >
                        {item.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ card, small, lost, cardRef, isSkipped }) => {
  const [colorSrc, setColorSrc] = useState();
  const [cardNumber, setCardNumber] = useState();
  const [textColor, setTextColor] = useState("text-[#1a2c38]");

  const smallCardref = useRef();

  useEffect(() => {
    switch (card.cardNumber) {
      case 1:
        setCardNumber("A");
        break;
      case 11:
        setCardNumber("J");
        break;
      case 12:
        setCardNumber("Q");
        break;
      case 13:
        setCardNumber("K");
        break;
      default:
        setCardNumber(card.cardNumber);
        break;
    }
    switch (card.cardColor) {
      case 1:
        setColorSrc(hearts);
        setTextColor("text-[#e9113c]");
        break;
      case 2:
        setColorSrc(diamonds);
        setTextColor("text-[#e9113c]");
        break;
      case 3:
        setColorSrc(spades);
        setTextColor("text-[#1a2c38]");
        break;
      case 4:
        setColorSrc(clubs);
        setTextColor("text-[#1a2c38]");
        break;
      default:
        break;
    }
    // if (small) {
    //   setTimeout(() => {
    //     smallCardref.current.classList.add("flip");
    //     setTimeout(() => {
    //       smallCardref.current.classList.remove("flip");
    //     }, 500);
    //   }, 500);
    // }
  }, [card]);

  // useEffect(() => {}, [card]);
  return (
    <div
      ref={!small ? cardRef : smallCardref}
      className={`bg-white ${
        small
          ? `sm:w-[80px] sm:h-[126.4px] w-[40px] h-[64px] rounded-sm sm:m-0 mx-3 z-10 relative ${
              isSkipped ? "opacity-40" : ""
            }`
          : `w-[120px] h-[189.6px] rounded-md cursor-pointer z-10 shadow-md ${
              lost ? "flex border-8 border-[#e9113c]" : "border-0"
            }`
      } `}
    >
      <div
        className={`${textColor} flex flex-col items-center w-fit ${
          small ? "sm:gap-2 pl-1" : "gap-4 pl-3 pt-2"
        }`}
      >
        <span
          className={`font-bold ${small ? "sm:text-4xl text-lg" : "text-5xl"}`}
        >
          {cardNumber}
        </span>
        <img
          src={colorSrc}
          className={`${small ? "w-[16px] sm:w-[38px]" : "w-[50px]"}`}
        ></img>
      </div>
    </div>
  );
};

const CardBack = ({ small }) => {
  return (
    <div
      className={`${
        small
          ? "sm:w-[80px] sm:h-[126.4px] w-[40px] h-[64px]"
          : "w-[120px] h-[189.6px]"
      } rounded-md cursor-pointer shadow-md p-1 hidden sm:block`}
    >
      <div className="bg-[#007bff] rounded-md h-full flex justify-center items-center">
        <div className="bg-white w-1 h-1 rounded-full absolute top-2 left-2"></div>
        <div className="bg-white w-1 h-1 rounded-full absolute bottom-3 left-2"></div>
        <div className="bg-white w-1 h-1 rounded-full absolute top-2 right-2"></div>
        <div className="bg-white w-1 h-1 rounded-full absolute bottom-3 right-2"></div>
        <h1
          className={`text-white font-pacifico -rotate-[60deg] ${
            small ? "sm:text-2xl text-lg" : "text-4xl"
          }`}
        >
          Satta
        </h1>
      </div>
    </div>
  );
};

export default HiLo;
