var process = require("process");

module.exports = {
  backendURL: "https://accounts" + (process.env.NODE_ENV === "development" ? "-dev": "") + ".cereris.org"
}
