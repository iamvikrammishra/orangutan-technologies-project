const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  first_name: String,
  middle_name: String,
  last_name: String,
  phone_number: String,
  address_line_1: String,
  state: String,
  pin_code: String,
  country: String,
});

module.exports = mongoose.model("User", UserSchema);
