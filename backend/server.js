const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/csv-mapping", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  const results = [];
  
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      const standardizedData = results.map(row => ({
        first_name: row.f_name || row.firstname || "",
        middle_name: row.middlename || "",
        last_name: row.l_name || row.lastname || "",
        phone_number: row.mobile || row.phoneNumber || "",
        address_line_1: row.address || "",
        state: row.state || "",
        pin_code: row.postal_index_code || row.pin || "",
        country: row.country || "",
      }));

      await User.insertMany(standardizedData);
      fs.unlinkSync(filePath); // Delete temp file
      res.json({ message: "Data stored successfully!", data: standardizedData });
    });
});

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
