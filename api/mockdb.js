// Mock database for FarmConnect
const mockDatabase = {
    users: [
        {
            id: 1,
            email: 'farmer1@example.com',
            password: 'password123',
            role: 'farmer',
            name: 'John Farmer',
            location: 'California, USA',
            products: [1, 2],
            createdAt: '2023-01-15'
        },
        {
            id: 2,
            email: 'retailer1@example.com',
            password: 'password123',
            role: 'retailer',
            name: 'Sarah Retailer',
            businessName: 'Fresh Market',
            location: 'New York, USA',
            orders: [101],
            createdAt: '2023-02-20'
        }
    ],
    products: [
        {
            id: 1,
            farmerId: 1,
            name: 'Organic Tomatoes',
            category: 'vegetables',
            price: 2.5,
            unit: 'kg',
            available: 100,
            description: 'Fresh organic tomatoes grown without pesticides',
            image: '/images/tomatoes.jpg',
            rating: 4.8,
            createdAt: '2023-03-10'
        },
        {
            id: 2,
            farmerId: 1,
            name: 'Organic Apples',
            category: 'fruits',
            price: 3.2,
            unit: 'kg',
            available: 50,
            description: 'Sweet organic apples from our orchard',
            image: '/images/apples.jpg',
            rating: 4.9,
            createdAt: '2023-03-15'
        }
    ],
    orders: [
        {
            id: 101,
            retailerId: 2,
            farmerId: 1,
            items: [
                { productId: 1, quantity: 10, price: 2.5 },
                { productId: 2, quantity: 5, price: 3.2 }
            ],
            total: 41.0,
            status: 'pending',
            createdAt: '2023-04-01',
            deliveryDate: '2023-04-05'
        }
    ],
    messages: [
        {
            id: 1001,
            senderId: 2,
            receiverId: 1,
            orderId: 101,
            content: 'When can you deliver the order?',
            createdAt: '2023-04-02T10:30:00Z',
            read: true
        },
        {
            id: 1002,
            senderId: 1,
            receiverId: 2,
            orderId: 101,
            content: 'I can deliver on April 5th as agreed.',
            createdAt: '2023-04-02T11:15:00Z',
            read: false
        }
    ]
};

// API simulation functions
const mockAPI = {
    // Authentication
    login: (email, password) => {
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

    // Registration
    register: (userData) => {
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
    },

    // Product operations
    getProducts: (farmerId = null) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let products = [...mockDatabase.products];
                if (farmerId) {
                    products = products.filter(p => p.farmerId === farmerId);
                }
                resolve({
                    success: true,
                    products
                });
            }, 500);
        });
    },

    createProduct: (productData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newProduct = {
                    id: mockDatabase.products.length + 1,
                    ...productData,
                    createdAt: new Date().toISOString(),
                    rating: 0
                };
                mockDatabase.products.push(newProduct);
                resolve({
                    success: true,
                    product: newProduct
                });
            }, 700);
        });
    },

    // Order operations
    createOrder: (orderData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newOrder = {
                    id: mockDatabase.orders.length + 101,
                    ...orderData,
                    status: 'pending',
                    createdAt: new Date().toISOString()
                };
                mockDatabase.orders.push(newOrder);
                resolve({
                    success: true,
                    order: newOrder
                });
            }, 800);
        });
    },

    // Message operations
    getMessages: (userId, counterpartId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const messages = mockDatabase.messages.filter(m => 
                    (m.senderId === userId && m.receiverId === counterpartId) ||
                    (m.senderId === counterpartId && m.receiverId === userId)
                );
                resolve({
                    success: true,
                    messages
                });
            }, 600);
        });
    },

    sendMessage: (messageData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newMessage = {
                    id: mockDatabase.messages.length + 1001,
                    ...messageData,
                    createdAt: new Date().toISOString(),
                    read: false
                };
                mockDatabase.messages.push(newMessage);
                resolve({
                    success: true,
                    message: newMessage
                });
            }, 500);
        });
    }
};

// Export for both browser and Node.js environments
if (typeof window !== 'undefined') {
    window.mockAPI = mockAPI;
    window.mockDatabase = mockDatabase;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { mockDatabase, mockAPI };
}