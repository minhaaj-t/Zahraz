const { initDatabase, insertDummyData } = require('./config/initDatabase');

async function setup() {
  try {
    console.log('🚀 Setting up database...');
    await initDatabase();
    console.log('✅ Database tables created');
    
    console.log('📦 Inserting dummy data...');
    await insertDummyData();
    console.log('✅ Dummy data inserted');
    
    console.log('✨ Setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setup();

