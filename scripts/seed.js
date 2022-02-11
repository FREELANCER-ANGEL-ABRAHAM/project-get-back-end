const database = require('../src/database');
const User = require('../src/models/Users');

const db = database.connect();

db.once('open', async function () {
  try {
    await db.collection('users').deleteMany({});

    console.log('seeding users...');
    const result = await User.create([
      {
        username: 'admin1',
        password: '123456',
      },
      {
        username: 'admin2',
        password: '12345',
      },
    ]);

    console.log(await User.find());
    console.log(result);
    db.close();
  } catch (error) {
    console.log(error);
  }
});
