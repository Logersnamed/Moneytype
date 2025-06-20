function getFileData(path) {
  const fs = require("fs");
  try {
    const data = fs.readFileSync(path, "utf-8");
    const jsonData = JSON.parse(data);

    return jsonData;
  } catch (err) {
    console.error(err);
    return { error: "Failed to read the file." };
  }
}

module.exports = { getFileData };