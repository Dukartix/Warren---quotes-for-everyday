const API_URL = 'https://api.api-ninjas.com/v2/quotes';
const API_KEY = 'EFG3H3r8W8KBhGf+WrMOoA==ehzTTDWiKBYmyO7Q';
const container = document.getElementById('quotes-container');
const reloadButton = document.getElementById('reload');

async function fetchQuotes() {
  container.innerHTML = '<p>Loading quotes...</p>';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(API_URL, {
      headers: { 'X-Api-Key': API_KEY },
      signal: controller.signal
    });

       
    clearTimeout(timeout);
       
    if (!response.ok) {
      if (response.status === 401) showError('Authentication failed.');
      else if (response.status === 404) showError('Service not found.');
      else if (response.status === 429) showError('Too many requests.');
      else if (response.status >= 500) showError('Server error.');
      else showError('Unknown API error.');
      console.error(response.status, response.statusText);
      return;
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) showError('No quotes available.');
    else {
      const quotesToDisplay = data.slice(0, 10);
      container.innerHTML = quotesToDisplay.map(q => `
        <div class="quote-card">"${q.quote}" - ${q.author || 'Unknown'}</div>
      `).join('');
    }

  } catch (error) {
    if (error.name === 'AbortError') showError('Request timed out.');
    else if (error.name === 'TypeError') showError('Network error.');
    else showError('Unexpected error.');
    console.error(error);
  } finally {
    clearTimeout(timeout);
  }
}

function showError(msg) {
  container.innerHTML = `<p style="color:red;">${msg}</p>`;
}

reloadButton.addEventListener('click', fetchQuotes);
fetchQuotes();