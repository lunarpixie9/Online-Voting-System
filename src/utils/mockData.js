export const mockVotes = {};

export const hasVoted = (voter_id, election_id) =>
  mockVotes[voter_id]?.[election_id] !== undefined;

export const castVote = (voter_id, election_id, candidate_id) => {
  if (!mockVotes[voter_id]) mockVotes[voter_id] = {};
  mockVotes[voter_id][election_id] = candidate_id;
};