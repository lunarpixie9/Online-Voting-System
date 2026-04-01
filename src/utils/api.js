const BASE_URL = 'http://localhost/voting-backend/api';

async function get(url) {
  const res = await fetch(url);
  return res.json();
}

async function post(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export const api = {
  login: (email, password, role) =>
    post(`${BASE_URL}/login.php`, { email, password, role }),

  register: (name, email, mobile, password) =>
    post(`${BASE_URL}/register.php`, { name, email, mobile, password }),

  getElections: () =>
    get(`${BASE_URL}/elections.php`),

  getCandidates: (election_id) =>
    get(`${BASE_URL}/elections.php?election_id=${election_id}`),

  castVote: (voter_id, candidate_id, election_id) =>
    post(`${BASE_URL}/vote.php`, { voter_id, candidate_id, election_id }),

  getResults: (election_id) =>
    get(`${BASE_URL}/results.php?election_id=${election_id}`),
};