console.log("this is loaded.");


//====================SPOTIFY====================================
exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
  };


//================== SEAT GEEK (for concerts)====================
// https://api.seatgeek.com/2/events?performers.slug=dream-theater&client_id=MTQ0MTM3OTV8MTU0NDg0MjEwMC45OQ

exports.seatGeek = {
  id: process.env.SEATGEEK_ID,
  secret: process.env.SEATGEEK_SECRET
}
//================== OMDB (for movies) ==============================
exports.omdb = {
  id: process.env.OMDB_ID,
 
};