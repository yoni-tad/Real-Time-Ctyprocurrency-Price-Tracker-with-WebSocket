import { useEffect, useState } from "react";
import btcIcon from "./assets/btc.png";
import ethIcon from "./assets/eth.png";
import tonIcon from "./assets/ton.png";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3000/");
const iconMap = {
  BTCUSDT: btcIcon,
  ETHUSDT: ethIcon,
  TONUSDT: tonIcon,
};

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [currencyData, setCurrencyData] = useState([]);

  useEffect(() => {
    socket.on("currencyData", (data) => {
      if (data) {
        setCurrencyData(data);
      }
    });

    return () => {
      socket.off("currencyData");
    };
  }, []);

  return (
    <div className="flex flex-col gap-2 justify-center items-center h-screen">
      <p className="pb-10 text-2xl font-bold w-96 text-center">Real-Time Cryptocurrency Price Tracker with WebSocket</p>
      {currencyData.length === 0 ? (
        <p className="text-gray-500">Loading currency data...</p>
      ) : (
        currencyData.map((currency) => {
          return (
            <div key={currency.symbol} className="w-108">
              <div className="flex justify-between items-center shadow-lg p-5 rounded-xl">
                <div className="flex items-center gap-2">
                  <img
                    src={iconMap[currency.symbol]}
                    className="h-12"
                    alt={currency.symbol}
                  />
                  <div className="flex-col">
                    <p className="text-xl font-bold">
                      Bitcoin ({currency.symbol})
                    </p>
                    <p className="text-2sm font-semibold">
                      Vol. $
                      {Number(currency.quoteVolume).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-xl font-bold">
                    $ {Number(currency.lastPrice).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      Number(currency.priceChangePercent) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {Number(currency.priceChangePercent).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
