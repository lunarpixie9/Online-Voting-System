-- ============================================================
-- Online Voting System — Database Schema
-- Normalized to 3NF
-- ============================================================

CREATE DATABASE IF NOT EXISTS voting_system;
USE voting_system;

-- TABLE: Admin
CREATE TABLE Admin (
    admin_id   INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(100) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE: Voter
CREATE TABLE Voter (
    voter_id   INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(100) NOT NULL UNIQUE,
    mobile     VARCHAR(15)  NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE: Election
CREATE TABLE Election (
    election_id  INT AUTO_INCREMENT PRIMARY KEY,
    title        VARCHAR(200) NOT NULL,
    description  TEXT,
    start_date   DATE NOT NULL,
    end_date     DATE NOT NULL,
    status       ENUM('upcoming', 'active', 'closed') DEFAULT 'upcoming',
    created_by   INT NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES Admin(admin_id) ON DELETE CASCADE
);

-- TABLE: Candidate
CREATE TABLE Candidate (
    candidate_id  INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    party         VARCHAR(100),
    bio           TEXT,
    election_id   INT NOT NULL,
    FOREIGN KEY (election_id) REFERENCES Election(election_id) ON DELETE CASCADE
);

-- TABLE: Vote
-- CONSTRAINT: 1 voter -> 1 vote per election
CREATE TABLE Vote (
    vote_id      INT AUTO_INCREMENT PRIMARY KEY,
    voter_id     INT NOT NULL,
    candidate_id INT NOT NULL,
    election_id  INT NOT NULL,
    voted_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (voter_id)     REFERENCES Voter(voter_id)         ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES Candidate(candidate_id) ON DELETE CASCADE,
    FOREIGN KEY (election_id)  REFERENCES Election(election_id)   ON DELETE CASCADE,
    UNIQUE KEY one_vote_per_election (voter_id, election_id)
);