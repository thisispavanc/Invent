const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Pavanc12345@',
      database: 'tanuh_inventory'
    });

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('admin123', salt);
    
    const [result] = await connection.execute(
      'INSERT INTO users (username, email, password_hash, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      ['admin', 'admin@tanuh.com', password_hash, 'super_admin', true]
    );
    
    console.log('✅ User created successfully!');
    console.log('Email: admin@tanuh.com');
    console.log('Password: admin123');
    console.log('Role: super_admin');
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('ℹ️  User already exists. Try logging in with:');
      console.log('Email: admin@tanuh.com');
      console.log('Password: admin123');
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
})();
