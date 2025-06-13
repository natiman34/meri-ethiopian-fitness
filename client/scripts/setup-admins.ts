import { setupAdminAccounts } from '../src/utils/setupAdminAccounts';

console.log('Setting up admin accounts...');

setupAdminAccounts()
  .then(() => {
    console.log('Admin account setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error setting up admin accounts:', error);
    process.exit(1);
  });
