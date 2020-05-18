const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/stats', async(req, res) => {
  const data = await client.query('SELECT * from stats');

  res.json(data.rows);
});

// grab current user stats
// select * from stats
// WHERE user_id = $1

// stats for ALL users
// SELECT stats.highest_score, stats.total_score, stats.games_played, (stats.total_score / stats.games_played) AS average, users.display_name AS name
// FROM stats
// JOIN users ON stats.user_id=users.id

app.use(require('./middleware/error'));

module.exports = app;
