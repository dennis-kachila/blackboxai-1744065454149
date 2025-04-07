// Global variables
let currentUser = null;
let currentHouse = null;
const API_BASE_URL = 'https://6xt4w4-8000.csb.app';

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// Initialize the application
async function initApp() {
    try {
        loadPageSpecificContent();
        
        // Check if user is logged in
        const userSession = sessionStorage.getItem('currentUser');
        if (userSession) {
            currentUser = JSON.parse(userSession);
            updateNavForLoggedInUser();
        }
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

// Load page-specific content
function loadPageSpecificContent() {
    const path = window.location.pathname.split('/').pop();
    
    switch(path) {
        case 'index.html':
            loadFeaturedProperties();
            break;
        case 'counties.html':
            loadCounties();
            break;
        case 'county-details.html':
            loadCountyDetails();
            break;
        case 'house-details.html':
            loadHouseDetails();
            break;
        case 'payment.html':
            loadPaymentDetails();
            break;
    }
}

// Load counties list
async function loadCounties() {
    const container = document.getElementById('countiesContainer');
    if (!container) {
        console.error('Counties container not found');
        return;
    }
    
    try {
        console.log('Fetching counties from:', `${API_BASE_URL}/api/counties`);
        const response = await fetch(`${API_BASE_URL}/api/counties`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const counties = await response.json();
        
        container.innerHTML = await Promise.all(counties.map(async county => {
            const townsResponse = await fetch(`${API_BASE_URL}/api/counties/${county.id}/towns`);
            const towns = await townsResponse.json();
            
            return `
                <div class="bg-white rounded-lg shadow-md overflow-hidden house-card">
                    <div class="p-6">
                        <h3 class="text-xl font-bold mb-2">${county.name}</h3>
                        <p class="text-gray-600 mb-4">${towns.length} main towns</p>
                        <a href="county-details.html?countyId=${county.id}" 
                           class="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                            View Properties
                        </a>
                    </div>
                </div>
            `;
        }));
    } catch (error) {
        console.error('Error loading counties:', error);
        // Fallback to localStorage
        const data = JSON.parse(localStorage.getItem('makaaziData') || '{"counties":[]}');
        container.innerHTML = data.counties.map(county => `
            <div class="bg-white rounded-lg shadow-md overflow-hidden house-card">
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-2">${county.name}</h3>
                    <p class="text-gray-600 mb-4">${county.towns.length} main towns</p>
                    <a href="county-details.html?countyId=${county.id}" 
                       class="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                        View Properties
                    </a>
                </div>
            </div>
        `).join('');
    }
}

// [Rest of your existing functions remain unchanged...]