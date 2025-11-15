require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
app.use(cors());
const body_parser = require('body-parser');
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
//include endpoints
require("./routes/index")(app);


(async () => {
app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
})();
