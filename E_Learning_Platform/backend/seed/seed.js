require('dotenv').config();
const { connectDB } = require('../src/config/db');
const Course = require('../src/models/course.model');
const Internship = require('../src/models/internship.model');
const Application = require('../src/models/application.model');
const { coursesData, internshipsData } = require('./seedData');
const { ensureAdminUser } = require('../src/config/adminBootstrap');

const seedDB = async (quiet = false) => {
  try {
    if (!quiet) console.log('🧹 Clearing existing courses, internships, and applications...');
    await Course.deleteMany({});
    await Internship.deleteMany({});
    await Application.deleteMany({});

    if (!quiet) console.log(`📚 Inserting ${coursesData.length} training courses...`);
    await Course.insertMany(coursesData);

    if (!quiet) console.log(`💼 Inserting ${internshipsData.length} industrial internships...`);
    await Internship.insertMany(internshipsData);

    if (!quiet) console.log('👤 Ensuring dedicated Admin account (Admin@gmail.com)...');
    await ensureAdminUser();

    if (!quiet) console.log('🎉 Seeding successfully completed!');
    return true;
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
};

// If run directly from CLI
if (require.main === module) {
  (async () => {
    try {
      console.log('🌱 Starting DB Seeder CLI...');
      await connectDB();
      await seedDB();
      console.log('✅ Seed completed. Exiting.');
      process.exit(0);
    } catch (err) {
      console.error('Fatal seed failure:', err);
      process.exit(1);
    }
  })();
}

module.exports = { seedDB };
