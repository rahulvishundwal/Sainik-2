// Generate Password Hash for Admin User
// Run this file to create a new password hash for the admin user

const bcrypt = require('bcryptjs');

async function generatePasswordHash() {
  // Change this to your desired password
  const password = 'admin123';
  
  console.log('🔐 Generating password hash...\n');
  console.log(`Password: ${password}`);
  
  const hash = await bcrypt.hash(password, 10);
  
  console.log(`\nBcrypt Hash:\n${hash}`);
  console.log('\n📋 Copy the hash above and use it in your database INSERT statement:');
  console.log('\nINSERT INTO users (email, password, role) VALUES');
  console.log(`('admin@sainikdefense.com', '${hash}', 'admin');`);
  console.log('\n✅ Done!');
}

generatePasswordHash();
