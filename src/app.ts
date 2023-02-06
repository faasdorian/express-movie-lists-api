import express from "express";
import exceptionHandler from "./middleware/exceptionHandler";
import auth from "./routes/auth.route";
import list from "./routes/list.route";
import item from "./routes/item.route";
import movie from "./routes/movie.route";

const app = express();

app.use(express.json());
app.use("/auth", auth);
app.use("/list", list);
app.use("/items", item);
app.use("/movie", movie);

app.use(exceptionHandler);

export default app;