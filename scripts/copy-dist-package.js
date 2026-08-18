import fs from 'fs';
import path from 'path';

const rootPkgPath = path.resolve(process.cwd(), 'package.json');
const distDir = path.resolve(process.cwd(), 'dist');
const distPkgPath = path.resolve(distDir, 'package.json');

if (fs.existsSync(rootPkgPath) && fs.existsSync(distDir)) {
  const pkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
  
  // Make a version of package.json tailored for inside dist/
  const distPkg = {
    ...pkg,
    main: 'server.cjs',
    scripts: {
      ...pkg.scripts,
      start: 'node server.cjs'
    }
  };
  
  fs.writeFileSync(distPkgPath, JSON.stringify(distPkg, null, 2));
  console.log('Successfully generated dist/package.json for Hostinger deployment');
  
  // Also copy .npmrc if present
  const npmrcPath = path.resolve(process.cwd(), '.npmrc');
  if (fs.existsSync(npmrcPath)) {
    fs.copyFileSync(npmrcPath, path.resolve(distDir, '.npmrc'));
  }
}
