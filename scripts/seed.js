const database = require('../src/database');
const User = require('../src/models/Users');

const db = database.connect();

db.once('open', async function () {
  try {
    await db.collection('users').deleteMany({});

    console.log('seeding users...');
    const result = await User.create([
      {
        username: process.env.ADMIN1_USERNAME,
        password: process.env.ADMIN1_PASSWORD
      },
      {
        username: process.env.ADMIN2_USERNAME,
        password: process.env.ADMIN2_PASSWORD
      },
      {
        username: process.env.ADMIN3_USERNAME,
        password: process.env.ADMIN3_PASSWORD
      }
    ]);
    console.log(result);
    db.close();
  } catch (error) {
    console.log(error);
  }
});
