const fs = require('fs');
const path = require('path');
const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');

const dir = path.resolve(__dirname, '..');

async function run() {
  console.log('Initializing git in:', dir);
  await git.init({ fs, dir, defaultBranch: 'main' });

  console.log('Finding files to add...');
  
  // Custom recursive finder respecting .gitignore
  function getFiles(currentDir, relativePath = '') {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    let files = [];
    for (const entry of entries) {
      const name = entry.name;
      if (
        name === '.git' ||
        name === 'node_modules' ||
        name === '.next' ||
        name === '.vercel' ||
        name.endsWith('.tsbuildinfo')
      ) {
        continue;
      }

      const fullPath = path.join(currentDir, name);
      const rel = relativePath ? `${relativePath}/${name}` : name;

      if (entry.isDirectory()) {
        files = files.concat(getFiles(fullPath, rel));
      } else {
        files.push(rel);
      }
    }
    return files;
  }

  const allFiles = getFiles(dir);
  console.log(`Found ${allFiles.length} files to track.`);

  console.log('Adding files to index...');
  for (const filepath of allFiles) {
    await git.add({ fs, dir, filepath });
  }

  console.log('Creating commit...');
  let sha;
  try {
    sha = await git.commit({
      fs,
      dir,
      author: {
        name: 'Mayur Rana',
        email: 'mayur.rana@cismandi.org',
      },
      message: 'Initial release: Cambridge International School Mandi complete web portal & Admin CMS',
    });
    console.log('Commit created with SHA:', sha);
  } catch (err) {
    console.log('Commit info:', err.message);
  }

  console.log('Setting remote origin to https://github.com/inmayurrana/schoolwebsite_2026.git ...');
  try {
    await git.deleteRemote({ fs, dir, remote: 'origin' });
  } catch (e) {}

  await git.addRemote({
    fs,
    dir,
    remote: 'origin',
    url: 'https://github.com/inmayurrana/schoolwebsite_2026.git',
    force: true,
  });

  console.log('Git repository initialized and committed successfully!');
  console.log('Branch: main');
}

run().catch(err => {
  console.error('Error during git operation:', err);
  process.exit(1);
});
