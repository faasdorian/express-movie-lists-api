import express from "express";
import exceptionHandler from "./middleware/exceptionHandler";
import auth from "./routes/auth";
import list from "./routes/list";

const app = express();

app.use(express.json());
app.use("/auth", auth);
app.use("/list", list);

app.use(exceptionHandler);

app.listen(3000);
