import Appbar from "./components/Appbar";
import Mine from "./pages/Mine";
import useTotalAmount from "./hooks/useTotalAmount";
import Dice from "./pages/Dice";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Loader from "./components/Loader";
import HiLo from "./pages/HiLo";

function App() {
  const [totalAmount, setTotalAmount] = useTotalAmount();

  return (
    <BrowserRouter>
      <div className="h-dvh flex flex-col bg-[#1a2c38]">
        <Appbar totalAmount={totalAmount} />
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route
            path="/mines"
            element={
              <Mine
                totalAmount={totalAmount}
                setTotalAmount={setTotalAmount}
              ></Mine>
            }
          ></Route>
          <Route
            path="/dice"
            element={
              <Dice
                totalAmount={totalAmount}
                setTotalAmount={setTotalAmount}
              ></Dice>
            }
          ></Route>
          <Route
            path="/hilo"
            element={
              <HiLo
                totalAmount={totalAmount}
                setTotalAmount={setTotalAmount}
              ></HiLo>
            }
          ></Route>
          <Route path="/loader" element={<Loader></Loader>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
