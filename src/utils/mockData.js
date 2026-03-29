export const mockElections = [
  {
    election_id: 1,
    title: 'Class Representative Election',
    description: 'Elect your CR for the academic year 2025–26.',
    icon: '🎓',
    start_date: '2025-04-01',
    end_date: '2025-04-07',
    status: 'active',
    admin_id: 1,
  },
  {
    election_id: 2,
    title: 'College Council Election',
    description: 'Vote for President, Vice President and Secretary.',
    icon: '🏛️',
    start_date: '2025-04-01',
    end_date: '2025-04-07',
    status: 'active',
    admin_id: 1,
  },
  {
    election_id: 3,
    title: 'Cultural Committee Head',
    description: 'Choose the Cultural Head for all fest activities.',
    icon: '🎭',
    start_date: '2025-04-01',
    end_date: '2025-04-07',
    status: 'active',
    admin_id: 1,
  },
  {
    election_id: 4,
    title: 'Technical Committee Head',
    description: 'Elect the Technical Head to lead hackathons and tech events.',
    icon: '💻',
    start_date: '2025-04-05',
    end_date: '2025-04-12',
    status: 'upcoming',
    admin_id: 1,
  },
  {
    election_id: 5,
    title: 'Sports Committee Head',
    description: 'Vote for the Sports Head to represent CHRIST on the field.',
    icon: '⚽',
    start_date: '2025-03-01',
    end_date: '2025-03-15',
    status: 'closed',
    admin_id: 1,
  },
];

export const mockCandidates = {
  1: [
    { candidate_id: 1, name: 'Ananya Sharma',  party: 'BCA Section A', bio: 'Passionate about student welfare and campus inclusion.', election_id: 1, votes: 42 },
    { candidate_id: 2, name: 'Rohan Mehta',    party: 'BCA Section B', bio: 'Focused on academic support and faculty communication.', election_id: 1, votes: 37 },
    { candidate_id: 3, name: 'Priya Nair',     party: 'BCA Section C', bio: 'Advocating for lab upgrades and better study resources.', election_id: 1, votes: 28 },
  ],
  2: [
    { candidate_id: 4, name: 'Arjun Kapoor',   party: 'Progressive Alliance', bio: 'Former event organiser with strong leadership skills.', election_id: 2, votes: 55 },
    { candidate_id: 5, name: 'Sneha Reddy',    party: 'Student First',        bio: 'Committed to transparent governance and student rights.', election_id: 2, votes: 48 },
    { candidate_id: 6, name: 'Dev Patel',       party: 'Unity Front',          bio: 'Experienced in college fest management and outreach.', election_id: 2, votes: 31 },
    { candidate_id: 7, name: 'Aisha Khan',      party: 'Independent',          bio: 'Bringing a fresh, unbiased perspective to council.', election_id: 2, votes: 22 },
  ],
  3: [
    { candidate_id: 8,  name: 'Meera Iyer',    party: 'Arts Collective',  bio: 'Dance and drama enthusiast, led Christite 2024.', election_id: 3, votes: 60 },
    { candidate_id: 9,  name: 'Karan Singh',   party: 'Cultural Brigade', bio: 'Music club head with 3 years of event experience.', election_id: 3, votes: 45 },
    { candidate_id: 10, name: 'Tara Bose',     party: 'Independent',      bio: 'Fine arts student and campus mural project lead.', election_id: 3, votes: 33 },
  ],
  4: [
    { candidate_id: 11, name: 'Vikram Nair',   party: 'TechForward',   bio: 'Full-stack developer, led CHRIST Hackathon 2024.', election_id: 4, votes: 0 },
    { candidate_id: 12, name: 'Riya Thomas',   party: 'CodeCraft',     bio: 'AI/ML enthusiast and IEEE student branch member.', election_id: 4, votes: 0 },
    { candidate_id: 13, name: 'Siddharth Rao', party: 'Independent',   bio: 'Competitive programmer and robotics club member.', election_id: 4, votes: 0 },
  ],
  5: [
    { candidate_id: 14, name: 'Rahul Das',     party: 'Sports United', bio: 'State-level basketball player and team captain.', election_id: 5, votes: 88 },
    { candidate_id: 15, name: 'Pooja Verma',   party: 'Active CHRIST', bio: 'National-level athlete and fitness ambassador.', election_id: 5, votes: 62 },
  ],
};

export const mockVoters = [
  { voter_id: 1, name: 'Rewa', email: 'rewa@christuniversity.in', mobile: '9876543210', password: 'voter123' },
];

export const mockAdmin = { admin_id: 1, name: 'Admin', email: 'admin@christuniversity.in', username: 'admin', password: 'admin123' };

// Track votes: { voter_id: { election_id: candidate_id } }
export let mockVotes = {};

export const hasVoted = (voter_id, election_id) =>
  mockVotes[voter_id]?.[election_id] !== undefined;

export const castVote = (voter_id, election_id, candidate_id) => {
  if (hasVoted(voter_id, election_id)) return false;
  if (!mockVotes[voter_id]) mockVotes[voter_id] = {};
  mockVotes[voter_id][election_id] = candidate_id;
  mockCandidates[election_id].find(c => c.candidate_id === candidate_id).votes++;
  return true;
};
