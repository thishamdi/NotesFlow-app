/**
 * API Utility Functions for NotesFlow
 * Simple functions to interact with the PHP backend
 */

// Base API URL - change this to match your server configuration
const API_BASE_URL = 'http://localhost/project/api';

// Generic function to make fetch requests to the API
async function apiRequest(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add request body for POST, PUT methods
    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
    const responseData = await response.json();
    
    // Check if the response indicates an error
    if (!response.ok) {
      throw new Error(responseData.message || 'An error occurred');
    }
    
    return responseData;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// API functions for authentication
const AuthAPI = {
  // Register a new user
  register: async (name, email, password) => {
    return apiRequest('register.php', 'POST', { name, email, password });
  },
  
  // Login user
  login: async (email, password) => {
    return apiRequest('login.php', 'POST', { email, password });
  }
};

// API functions for notes
const NotesAPI = {
  // Get all notes for a user
  getNotes: async (userId) => {
    return apiRequest(`notes/read.php?user_id=${userId}`, 'GET');
  },
  
  // Get a single note
  getNote: async (noteId, userId) => {
    return apiRequest(`notes/read_one.php?id=${noteId}&user_id=${userId}`, 'GET');
  },
  
  // Create a new note
  createNote: async (userId, title, content) => {
    return apiRequest('notes/create.php', 'POST', { user_id: userId, title, content });
  },
  
  // Update an existing note
  updateNote: async (noteId, userId, title, content) => {
    return apiRequest('notes/update.php', 'PUT', { id: noteId, user_id: userId, title, content });
  },
  
  // Delete a note
  deleteNote: async (noteId, userId) => {
    // For DELETE requests, include the parameters in the URL for better compatibility
    return apiRequest(`notes/delete.php?id=${noteId}&user_id=${userId}`, 'DELETE');
  }
};
