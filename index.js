import express, {json} from "express";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";

import router from "./routes/index.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

//routes
app.use(router);

const port = process.env.PORT || 4000;
app.listen(port, () => 
    console.log(chalk.bold.green(`Server listenning on PORT: ${port}!`))
);