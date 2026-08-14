// Auth State Variables
var currentRole = 'customer'; // 'customer' or 'owner'
var isSignUp = true;          // true = Sign Up, false = Sign In

// Switch between screens
function showScreen(screenId) {
  document.getElementById('authPage').classList.add('hidden');
  document.getElementById('formPage').classList.add('hidden');
  document.getElementById('dashboardPage').classList.add('hidden');

  document.getElementById(screenId).classList.remove('hidden');

  if (screenId === 'dashboardPage') {
    loadDashboardReviews();
  }
}

// Change Role (Customer vs Business Owner)
function setRole(role) {
  currentRole = role;
  
  var custBtn = document.getElementById('roleCustomerBtn');
  var ownerBtn = document.getElementById('roleOwnerBtn');

  if (role === 'customer') {
    custBtn.classList.add('active');
    ownerBtn.classList.remove('active');
  } else {
    ownerBtn.classList.add('active');
    custBtn.classList.remove('active');
  }
}

// Toggle between Sign Up and Sign In Mode
function toggleAuthMode() {
  isSignUp = !isSignUp;

  var nameGroup = document.getElementById('nameGroup');
  var confirmPassGroup = document.getElementById('confirmPassGroup');
  var formTitle = document.getElementById('formTitle');
  var submitBtn = document.getElementById('submitBtn');
  var toggleText = document.getElementById('toggleText');
  var toggleAuthBtn = document.getElementById('toggleAuthBtn');
  var userNameInput = document.getElementById('userName');

  if (isSignUp) {
    formTitle.innerText = "Sign up";
    submitBtn.innerText = "Sign up";
    toggleText.innerText = "Already a Member?";
    toggleAuthBtn.innerText = "Sign in here";
    
    nameGroup.classList.remove('hidden');
    confirmPassGroup.classList.remove('hidden');
    userNameInput.required = true;
  } else {
    formTitle.innerText = "Sign in";
    submitBtn.innerText = "Sign in";
    toggleText.innerText = "Don't have an account?";
    toggleAuthBtn.innerText = "Sign up here";
    
    nameGroup.classList.add('hidden');
    confirmPassGroup.classList.add('hidden');
    userNameInput.required = false;
  }
}

// Handle Form Submission for both Sign Up & Sign In
function handleAuthSubmit(event) {
  event.preventDefault();
  
  // If user is customer -> take them to Customer Feedback Form
  if (currentRole === 'customer') {
    showScreen('formPage');
  } 
  // If user is business owner -> take them to Owner Dashboard
  else {
    showScreen('dashboardPage');
  }
}

// Quick Social Login
function quickLogin() {
  if (currentRole === 'customer') {
    showScreen('formPage');
  } else {
    showScreen('dashboardPage');
  }
}

// Handle Customer Feedback Submission
document.getElementById('feedbackForm').addEventListener('submit', function(event) {
  event.preventDefault();

  var name = document.getElementById('custName').value;
  var rating = document.getElementById('custRating').value;
  var category = document.getElementById('custCategory').value;
  var message = document.getElementById('custMessage').value;

  var newFeedback = {
    name: name,
    rating: rating,
    category: category,
    message: message,
    date: new Date().toLocaleDateString()
  };

  var savedFeedbacks = JSON.parse(localStorage.getItem('userFeedbacks')) || [];
  savedFeedbacks.unshift(newFeedback);
  localStorage.setItem('userFeedbacks', JSON.stringify(savedFeedbacks));

  document.getElementById('feedbackForm').classList.add('hidden');
  document.getElementById('successBox').classList.remove('hidden');
});

function resetFeedbackForm() {
  document.getElementById('feedbackForm').reset();
  document.getElementById('feedbackForm').classList.remove('hidden');
  document.getElementById('successBox').classList.add('hidden');
}

// Load Reviews into Dashboard
function loadDashboardReviews() {
  var reviewsList = document.getElementById('reviewsList');
  var savedFeedbacks = JSON.parse(localStorage.getItem('userFeedbacks')) || [];

  if (savedFeedbacks.length === 0) {
    reviewsList.innerHTML = "<p style='color: #6b7280;'>No reviews submitted yet.</p>";
    return;
  }

  var html = "";
  for (var i = 0; i < savedFeedbacks.length; i++) {
    var item = savedFeedbacks[i];
    var stars = "⭐".repeat(item.rating);

    html += `
      <div class="review-item">
        <div class="review-header">
          <span>${item.name} (${stars})</span>
          <span class="badge">${item.category}</span>
        </div>
        <p style="margin: 0; color: #374151;">${item.message}</p>
        <span style="font-size: 11px; color: #9ca3af;">${item.date}</span>
      </div>
    `;
  }

  reviewsList.innerHTML = html;
}