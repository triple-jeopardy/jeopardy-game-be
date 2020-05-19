const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

const authRoutes = createAuthRoutes();


// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

app.get('/leaderboard', async(req, res) => {
  try {
    const data = await client.query(`
  SELECT stats.highest_score, stats.total_score, stats.games_played, (stats.total_score / stats.games_played) AS average, users.display_name AS name
  FROM stats
  JOIN users ON stats.user_id=users.id`);
    res.json(data.rows);
  } catch(e) {
    res.json({ status: 500, responseText: 'Sorry, it seems something went wrong', e, }); 
  }
});

app.post('/api/results', async(req, res) => {
  try {
    const data = await client.query(`
    INSERT INTO stats (user_id, highest_score, total_score, games_played)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [req.userId, 0, 0, 0]);
    res.json(data.rows);
  } catch(e) {
    res.json({ status: 500, responseText: 'Sorry, it seems something went wrong', e, }); 
  }
});

app.put('/api/results', async(req, res) => {
  try {
    const data = await client.query(`
    UPDATE stats
    SET total_score = total_score + $1, games_played = games_played + 1
    WHERE user_id = $2
    RETURNING *
    `,
    [req.body.total_score, req.userId]);
    res.json(data.rows);
  } catch(e) {
    res.json({ status: 500, responseText: 'Sorry, it seems something went wrong', e, }); 
  }
});

app.get('/api/results', async(req, res) => {
  try {
    const data = await client.query(`
    SELECT *
    FROM stats
    WHERE user_id = $1
    `,
    [req.userId]);
    res.json(data.rows);
  } catch(e) {
    res.json({ status: 500, responseText: 'Sorry, it seems something went wrong', e, }); 
  }
});

app.use(require('./middleware/error'));

module.exports = app;
