import { platform as _platform } from 'os';

try {
  // Get the platform name (e.g., 'win32', 'darwin', 'linux')
  const platform = _platform();

  // Choose the appropriate predeploy script based on the platform
  switch (platform) {
    case 'darwin':
      require('child_process').execSync('npm run predeploy:mac', { stdio: 'inherit' });
      break;
    case 'linux':
      require('child_process').execSync('npm run predeploy:linux', { stdio: 'inherit' });
      break;
    case 'win32':
      require('child_process').execSync('npm run predeploy:windows', { stdio: 'inherit' });
      break;
    default:
      process.exit(1);
  }
} catch (error) {
  console.error('Error determining the operating system:', error);
  process.exit(1);
}
