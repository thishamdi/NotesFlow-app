// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
  const currentUser = sessionStorage.getItem('currentUser');
  const currentPage = window.location.pathname.split('/').pop();
  
  if (currentUser && (currentPage === 'login.html' || currentPage === 'register.html')) {
    window.location.href = 'dashboard.html';
  } else if (!currentUser && currentPage === 'dashboard.html') {
    window.location.href = 'login.html';
  }
});

// Show error message
function showError(message) {
  alert(message);
}

// Login form handling
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    try {
      // Send login request to PHP backend
      const response = await AuthAPI.login(email, password);
      
      if (response.success) {
        // Store user data in sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify(response.data));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
      } else {
        showError(response.message || 'Login failed');
      }
    } catch (error) {
      showError('Error logging in: ' + error.message);
    }
  });
}

// Register form handling
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }
    
    try {
      // Send registration request to PHP backend
      const response = await AuthAPI.register(name, email, password);
      
      if (response.success) {
        // Store user data in sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify(response.data));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
      } else {
        showError(response.message || 'Registration failed');
      }
    } catch (error) {
      showError('Error registering: ' + error.message);
    }
  });
}