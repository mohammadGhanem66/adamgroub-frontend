function getAuthToken() {
  return localStorage.getItem('accessToken');
}
function handleUnauthorized() {
  window.location.href = 'login.html';
}

function apiFetch(url, options = {}) {
  // Add default headers
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`,
    ...options.headers,
  };

  // Merge options with headers
  const config = {
    ...options,
    headers,
  };

  return fetch(url, config)
    .then(response => {
      if (response.status === 401) {
        handleUnauthorized();
        throw new Error('Unauthorized! Redirecting to login...');
      }
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
}
async function apiPostOrPut(apiUrl, method, body) {
  const token = localStorage.getItem('accessToken');

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(apiUrl, options);

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Unauthorized! Redirecting to login...');
    }

    // if (!response.ok) {
    //   throw new Error(`HTTP error! Status: ${response.status}`);
    // }

    // Check if response body is JSON
    const contentType = response.headers.get('Content-Type') || '';
    if (contentType.includes('application/json')) {
      return await response.json();
    } else {
      return { message: await response.text() }; // Handle non-JSON response
    }
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}
export { apiFetch, apiPostOrPut };