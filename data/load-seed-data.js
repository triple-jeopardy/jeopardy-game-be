const client = require('../lib/client');
// import our seed data:
const stats = require('./stats.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, display_name, hash)
                      VALUES ($1, $2, $3)
                      RETURNING *;
                  `,
        [user.email, user.display_name, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      stats.map(stat => {
        return client.query(`
                    INSERT INTO stats (highest_score, total_score, games_played, user_id)
                    VALUES ($1, $2, $3, $4);
                `,
        [stat.highest_score, stat.total_score, stat.games_played, user.id]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
