require('dotenv').config();
const cors = require("cors");
const app = require('./src/app')
app.use(cors());
const connectdb = require('./src/db/db')
connectdb();
app.listen(3000, () => {
    console.log("Server is running on port 3000")
})