module.exports = (req, res) => {
  res.json({ key: process.env.GOOGLE_MAPS_API_KEY });
};
