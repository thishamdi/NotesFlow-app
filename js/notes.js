// DOM Elements
const notesGrid = document.getElementById('notesGrid');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const noteModal = document.getElementById('noteModal');
const noteForm = document.getElementById('noteForm');
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const noteId = document.getElementById('noteId');
const modalTitle = document.getElementById('modalTitle');
const createNoteBtn = document.getElementById('createNoteBtn');
const emptyStateBtn = document.getElementById('emptyStateBtn');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const cancelBtn = document.getElementById('cancelBtn');
const closeModal = document.getElementById('closeModal');
const logoutBtn = document.getElementById('logoutBtn');

// Get current user
const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
if (!currentUser) {
  window.location.href = 'login.html';
}

// Store all notes
let allNotes = [];

// Load notes from PHP backend
async function loadNotes() {
  try {
    const response = await NotesAPI.getNotes(currentUser.id);
    allNotes = response.data || [];
    
    // Show/hide empty state
    if (allNotes.length === 0) {
      notesGrid.style.display = 'none';
      emptyState.style.display = 'block';
    } else {
      notesGrid.style.display = 'grid';
      emptyState.style.display = 'none';
      
      // Clear notes grid
      notesGrid.innerHTML = '';
      
      // Add notes to grid
      allNotes.forEach(note => {
        addNoteToGrid(note);
      });
    }
  } catch (error) {
    alert('Error loading notes: ' + error.message);
  }
}

// Add note to grid
function addNoteToGrid(note) {
  const noteCard = document.createElement('div');
  noteCard.className = 'note-card';
  noteCard.setAttribute('data-id', note.id);
  
  // Format date
  const date = new Date(note.created_at);
  const formattedDate = `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  
  noteCard.innerHTML = `
    <div class="note-actions">
      <button class="delete-note" data-id="${note.id}">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    <h3 class="note-title">${note.title}</h3>
    <p class="note-content">${note.content}</p>
    <span class="note-date">${formattedDate}</span>
  `;
  
  // Open note for editing on click
  noteCard.addEventListener('click', function(e) {
    // Don't open if delete button was clicked
    if (e.target.closest('.delete-note')) {
      return;
    }
    
    openNoteModal(note);
  });
  
  // Delete note on delete button click
  const deleteBtn = noteCard.querySelector('.delete-note');
  deleteBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    deleteNote(note.id);
  });
  
  notesGrid.appendChild(noteCard);
}

// Open modal for creating/editing note
function openNoteModal(note = null) {
  // Reset form
  noteForm.reset();
  
  if (note) {
    // Edit mode
    modalTitle.textContent = 'Edit Note';
    noteId.value = note.id;
    noteTitle.value = note.title;
    noteContent.value = note.content;
  } else {
    // Create mode
    modalTitle.textContent = 'Create Note';
    noteId.value = '';
  }
  
  // Show modal
  noteModal.classList.add('active');
}

// Close note modal
function closeNoteModal() {
  noteModal.classList.remove('active');
}

// Save note
async function saveNote() {
  const title = noteTitle.value;
  const content = noteContent.value;
  
  if (!title || !content) {
    alert('Please fill in all fields');
    return;
  }
  
  try {
    if (noteId.value) {
      // Edit existing note
      await NotesAPI.updateNote(noteId.value, currentUser.id, title, content);
    } else {
      // Create new note
      await NotesAPI.createNote(currentUser.id, title, content);
    }
    
    // Close modal
    closeNoteModal();
    
    // Reload notes
    loadNotes();
  } catch (error) {
    alert('Error saving note: ' + error.message);
  }
}

// Delete note
async function deleteNote(id) {
  if (confirm('Are you sure you want to delete this note?')) {
    try {
      await NotesAPI.deleteNote(id, currentUser.id);
      loadNotes();
    } catch (error) {
      alert('Error deleting note: ' + error.message);
    }
  }
}

// Search notes
function searchNotes(query) {
  if (!query) {
    // If search is empty, show all notes
    notesGrid.innerHTML = '';
    if (allNotes.length === 0) {
      notesGrid.style.display = 'none';
      emptyState.style.display = 'block';
      emptyState.querySelector('h2').textContent = 'No notes yet';
      emptyState.querySelector('p').textContent = 'Create your first note to get started';
    } else {
      notesGrid.style.display = 'grid';
      emptyState.style.display = 'none';
      allNotes.forEach(note => {
        addNoteToGrid(note);
      });
    }
    return;
  }
  
  // Filter notes by query
  const filteredNotes = allNotes.filter(note => {
    return note.title.toLowerCase().includes(query.toLowerCase()) || 
           note.content.toLowerCase().includes(query.toLowerCase());
  });
  
  // Clear notes grid
  notesGrid.innerHTML = '';
  
  // Show/hide empty state
  if (filteredNotes.length === 0) {
    notesGrid.style.display = 'none';
    emptyState.style.display = 'block';
    emptyState.querySelector('h2').textContent = 'No matching notes';
    emptyState.querySelector('p').textContent = 'Try searching for something else';
  } else {
    notesGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    // Add filtered notes to grid
    filteredNotes.forEach(note => {
      addNoteToGrid(note);
    });
  }
}

// Logout
function logout() {
  sessionStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', loadNotes);

if (createNoteBtn) {
  createNoteBtn.addEventListener('click', () => openNoteModal());
}

if (emptyStateBtn) {
  emptyStateBtn.addEventListener('click', () => openNoteModal());
}

if (saveNoteBtn) {
  saveNoteBtn.addEventListener('click', saveNote);
}

if (cancelBtn) {
  cancelBtn.addEventListener('click', closeNoteModal);
}

if (closeModal) {
  closeModal.addEventListener('click', closeNoteModal);
}

if (searchInput) {
  searchInput.addEventListener('input', () => {
    searchNotes(searchInput.value);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
  if (e.target === noteModal) {
    closeNoteModal();
  }
});