const fs = require('fs');
const path = require('path');
const git = require('isomorphic-git');
const nodeHttp = require('isomorphic-git/http/node');

const dir = path.resolve(__dirname, '..');

// Wrap nodeHttp with custom timeout (5 minutes)
const http = {
  request: async (opts) => {
    return nodeHttp.request({
      ...opts,
      timeout: 300000,
    });
  },
};

async function push() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  console.log('Attempting push to origin/main (with 5 min timeout)...');

  try {
    const pushResult = await git.push({
      fs,
      http,
      dir,
      remote: 'origin',
      ref: 'main',
      force: true,
      onProgress: (evt) => {
        console.log(`[Push Progress] ${evt.phase}: ${evt.loaded || ''}/${evt.total || ''}`);
      },
      onAuth: () => {
        if (token) {
          return { username: token, password: '' };
        }
        return undefined;
      },
    });
    console.log('Push completed successfully!', JSON.stringify(pushResult));
  } catch (err) {
    console.error('Push error:', err.message);
    if (err.data) {
      console.error('Data:', err.data);
    }
    process.exit(1);
  }
}

push();
