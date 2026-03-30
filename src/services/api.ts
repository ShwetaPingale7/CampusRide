// Placeholder for API services

const API_BASE_URL = 'https://api.campusride.example.com';

export const fetchAvailableRides = async () => {
  try {
    // const response = await fetch(`${API_BASE_URL}/rides`);
    // const data = await response.json();
    // return data;
    
    // Returning dummy data for now
    return [
      { id: '1', driver: 'Alice', destination: 'Engineering Block', time: '10:00 AM' },
      { id: '2', driver: 'Bob', destination: 'Library', time: '10:15 AM' },
    ];
  } catch (error) {
    console.error('Error fetching rides:', error);
    throw error;
  }
};
