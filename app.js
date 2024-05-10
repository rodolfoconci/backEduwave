import "dotenv/config";
import express from "express";
import inventorRouter from "./routes/inventor.js";

const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use("/api/inventor", inventorRouter);

app.listen(PORT, () => {
  console.log("Servidor Web en el puerto:", PORT);
});
