/**
 * Persistent Data Storage for MoodUI Studio
 * Stores users and projects in server/data/ with atomic file writes.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

// Ensure data directory and files exist
function initDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
  if (!fs.existsSync(PROJECTS_FILE)) {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

initDb();

function readJson(file) {
  try {
    const raw = fs.readFileSync(file, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${file}:`, e);
    return [];
  }
}

function writeJson(file, data) {
  const tempFile = `${file}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempFile, file);
}

// User Queries
export const db = {
  findUserByEmail(email) {
    if (!email) return null;
    const users = readJson(USERS_FILE);
    return users.find(u => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
  },

  findUserById(id) {
    if (!id) return null;
    const users = readJson(USERS_FILE);
    return users.find(u => u.id === id) || null;
  },

  createUser(user) {
    const users = readJson(USERS_FILE);
    users.push(user);
    writeJson(USERS_FILE, users);
    return user;
  },

  updateUser(id, updates) {
    const users = readJson(USERS_FILE);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
    writeJson(USERS_FILE, users);
    return users[index];
  },

  // Project Queries (User-isolated)
  getProjectsByUserId(userId) {
    if (!userId) return [];
    const projects = readJson(PROJECTS_FILE);
    return projects.filter(p => p.userId === userId).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  getProjectById(projectId, userId) {
    const projects = readJson(PROJECTS_FILE);
    const project = projects.find(p => p.id === projectId);
    if (!project) return null;
    if (project.userId !== userId) {
      return { unauthorized: true };
    }
    return project;
  },

  saveProject(project) {
    const projects = readJson(PROJECTS_FILE);
    const index = projects.findIndex(p => p.id === project.id);
    if (index >= 0) {
      // Check ownership
      if (projects[index].userId !== project.userId) {
        return { unauthorized: true };
      }
      projects[index] = { ...projects[index], ...project, updatedAt: new Date().toISOString() };
    } else {
      projects.push({
        ...project,
        createdAt: project.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    writeJson(PROJECTS_FILE, projects);
    return project;
  },

  deleteProject(projectId, userId) {
    const projects = readJson(PROJECTS_FILE);
    const index = projects.findIndex(p => p.id === projectId);
    if (index === -1) return false;
    if (projects[index].userId !== userId) {
      return { unauthorized: true };
    }
    projects.splice(index, 1);
    writeJson(PROJECTS_FILE, projects);
    return true;
  }
};
