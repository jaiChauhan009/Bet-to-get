import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

const useTotalAmount = () => {
  const [totalAmount, setTotalAmount] = useLocalStorage("Total-Amount", 50.0);

  return [totalAmount, setTotalAmount];
};

export default useTotalAmount;
