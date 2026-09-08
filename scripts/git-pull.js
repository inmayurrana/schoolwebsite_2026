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

async function pull() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  console.log('Fetching & pulling latest changes from origin/main...');

  try {
    await git.pull({
      fs,
      http,
      dir,
      remote: 'origin',
      ref: 'main',
      singleBranch: true,
      author: {
        name: 'Mayur Rana',
        email: 'mayur.rana@cismandi.org',
      },
      onProgress: (evt) => {
        console.log(`[Pull Progress] ${evt.phase}: ${evt.loaded || ''}/${evt.total || ''}`);
      },
      onAuth: () => {
        if (token) {
          return { username: token, password: '' };
        }
        return undefined;
      },
    });

    const commits = await git.log({ fs, dir, depth: 1 });
    const latest = commits[0];
    console.log('Successfully pulled and updated local workspace!');
    console.log('Latest Commit on main:', latest.oid.substring(0, 7), latest.commit.message);
  } catch (err) {
    console.error('Pull error:', err.message);
    if (err.data) {
      console.error('Data:', err.data);
    }
    process.exit(1);
  }
}

pull();
