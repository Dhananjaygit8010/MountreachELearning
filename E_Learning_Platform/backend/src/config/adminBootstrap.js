const User = require('../models/user.model');

/**
 * Ensures that exactly one Admin user exists with credentials:
 * Email: admin@gmail.com (case-insensitive)
 * Password: Admin@123
 * Role: admin
 *
 * Any other user with role 'admin' is demoted to 'student'.
 */
const ensureAdminUser = async () => {
  try {
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'Admin@123';

    let adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      console.log('👤 Admin user not found. Creating dedicated Admin (Admin@gmail.com)...');
      adminUser = new User({
        name: 'System Administrator',
        email: adminEmail,
        password: adminPassword,
        college: 'Mountreach Solution Pvt. Ltd.',
        branch: 'Administration & IT Operations',
        role: 'admin',
      });
      await adminUser.save();
      console.log('✅ Dedicated Admin user created successfully.');
    } else {
      // Ensure password and role are exact
      adminUser.name = adminUser.name || 'System Administrator';
      adminUser.role = 'admin';
      adminUser.password = adminPassword; // Triggers pre-save hook to hash Admin@123
      await adminUser.save();
      console.log('✅ Dedicated Admin credentials verified and synchronized.');
    }

    // Demote any other user with role 'admin' to 'student'
    const demoted = await User.updateMany(
      { email: { $ne: adminEmail }, role: 'admin' },
      { $set: { role: 'student' } }
    );
    if (demoted.modifiedCount > 0) {
      console.log(`🔒 Demoted ${demoted.modifiedCount} unauthorized admin accounts to 'student'.`);
    }

    return adminUser;
  } catch (err) {
    console.error('❌ Failed to ensure admin user:', err.message);
    throw err;
  }
};

module.exports = { ensureAdminUser };
