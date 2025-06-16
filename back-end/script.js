import axios from "axios";
import express from "express";
import http from "http";
import { Server } from "socket.io";

const getCurrencyData = async () => {
  const currencies = ["BTCUSDT", "ETHUSDT", "TONUSDT"];
  try {
    const promises = currencies.map(async (currency) => {
      try {
        const res = await axios.get(
          `https://api.binance.com/api/v3/ticker/24hr?symbol=${currency}`
        );
        return res.data;
      } catch (e) {
        return { symbol: currency, error: true };
      }
    });
    const response = await Promise.all(promises);

    return response;
  } catch (e) {
    console.log("API call error: " + e.message);
    return [];
  }
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let latestPriceData = [];

setInterval(async () => {
  latestPriceData = await getCurrencyData();
  io.emit("currencyData", latestPriceData);
}, 1000);

io.on("connection", async (socket) => {
  console.log("New connection: " + socket.id);
  socket.emit("currencyData", latestPriceData);

  socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(3000, () => console.log("Server start listening at 3000"));
