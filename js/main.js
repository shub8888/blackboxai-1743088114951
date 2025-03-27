// Session simulation
let currentUser = null;

// Check if user is already logged in (simulated)
function checkAuth() {
    const token = localStorage.getItem('farmconnect_token');
    if (token) {
        const userId = parseInt(token.split('-')[2]);
        currentUser = mockDatabase.users.find(u => u.id === userId);
        if (currentUser) {
            // Redirect to appropriate dashboard
            if (window.location.pathname.includes('auth')) {
                window.location.href = currentUser.role === 'farmer' 
                    ? '/farmer/dashboard.html' 
                    : '/retailer/dashboard.html';
            }
        }
    }
}

// Core functionality for FarmConnect
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    // Mobile menu toggle functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Form validation for registration
    const registerForm = document.querySelector('form[action="#"]');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const userRole = document.getElementById('userRole').value;
            
            // Validate password match
            if (password !== confirmPassword) {
                showToast('Passwords do not match!', 'error');
                return;
            }
            
            // Validate role selection
            if (!userRole) {
                showToast('Please select whether you are a Farmer or Retailer', 'error');
                return;
            }
            
            // Prepare user data
            const userData = {
                email: document.getElementById('email').value,
                password: password,
                name: document.getElementById('fullName').value,
                role: userRole
            };

            // Simulate API call
            mockAPI.register(userData)
                .then(response => {
                    showToast('Account created successfully!');
                    // Redirect based on user role
                    if (userRole === 'farmer') {
                        window.location.href = '/farmer/dashboard.html';
                    } else {
                        window.location.href = '/retailer/dashboard.html';
                    }
                })
                .catch(error => {
                    showToast(error.message || 'Registration failed', 'error');
                });
        });
    }

    // Form validation for login
    const loginForm = document.querySelector('form[action="#"]');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simulate API call
            mockAPI.login(email, password)
                .then(response => {
                    showToast('Login successful!');
                    // Redirect based on user role
                    if (response.user.role === 'farmer') {
                        window.location.href = '/farmer/dashboard.html';
                    } else {
                        window.location.href = '/retailer/dashboard.html';
                    }
                })
                .catch(error => {
                    showToast(error.message || 'Login failed', 'error');
                });
        });
    }
});

// Utility functions
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-md text-white ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Mock API functions
const mockAPI = {
    login: async (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = mockDatabase.users.find(u => 
                    u.email === email && u.password === password
                );
                if (user) {
                    const token = `mock-token-${user.id}`;
                    localStorage.setItem('farmconnect_token', token);
                    resolve({
                        success: true,
                        token: token,
                        user: {
                            id: user.id,
                            email: user.email,
                            role: user.role,
                            name: user.name
                        }
                    });
                } else {
                    reject({
                        success: false,
                        message: 'Invalid email or password'
                    });
                }
            }, 800);
        });
    },
    
    register: async (userData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = {
                    id: mockDatabase.users.length + 1,
                    ...userData,
                    createdAt: new Date().toISOString(),
                    products: [],
                    orders: []
                };
                mockDatabase.users.push(newUser);
                resolve({
                    success: true,
                    user: newUser
                });
            }, 1000);
        });
    }
};

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { mockAPI };
}