// loader
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');

    loader.classList.add('loader--hidden');

    loader.addEventListener('transitionend', () => {
        document.body.removeChild(loader);
    });
});

// navbar mobile view
// open menu
function toggleMenu(){
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('show');
    document.addEventListener("click", closeMenuOnClickOutside)
}
// close menu
function closeMenu(){
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.remove('show');

    document.removeEventListener('click', closeMenuOnClickOutside)
}
function closeMenuOnClickOutside(event){
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.querySelector('.hamburger');

    if (!navLinks.contains(event.target) && !hamburger.contains(event.target)){
        closeMenu();
    }
}

// select

document.addEventListener('DOMContentLoaded', () => {
  const apiUrlCurrencies = 'https://api.freecurrencyapi.com/v1/currencies';
  const apiUrlConvert = 'https://api.freecurrencyapi.com/v1/latest';
  const apiKey = 'fca_live_FiQ6pQtQLHYcjkJsHAupBsn48JRGiC1vlDgDnu6Q';

  async function populateCurrencySelect(selectIds) {
      try {
          // Fetch supported currencies
          const response = await fetch(`${apiUrlCurrencies}?apikey=${apiKey}`);
          if (!response.ok) {
              throw new Error('Failed to fetch currencies');
          }

          const data = await response.json();
          const currencies = data.data;
          console.log(currencies);
          // Populate each select element
          selectIds.forEach(selectId => {
              const selectElement = document.getElementById(selectId);

              if (!selectElement) {
                  console.error(`Error: Element with ID ${selectId} not found.`);
                  return;
              }

              // Clear the loading option
              selectElement.innerHTML = '';

              // Populate options
              Object.entries(currencies).forEach(([code, details]) => {
                  const option = document.createElement('option');
                  option.value = code;
                  option.textContent = details.name ? `${details.name} (${code})` : code;
                  option.dataset.symbol = details.symbol || ''; // Save the symbol in a custom attribute
                  selectElement.appendChild(option);
              });
          });

          // Set default selections
          const currencyFrom = document.getElementById('currency-from');
          const currencyTo = document.getElementById('currency-to');
          if (currencyFrom && currencyTo) {
              currencyFrom.value = 'EUR';
              currencyTo.value = 'USD';

              updateOptionsOnSelectionChange(currencyFrom, currencyTo);
              updateOptionsOnSelectionChange(currencyTo, currencyFrom);
          }
      } catch (error) {
          console.error('Error fetching currencies:', error);
      }
  }

  function updateOptionsOnSelectionChange(sourceSelect, targetSelect) {
      sourceSelect.addEventListener('change', () => {
          const selectedValue = sourceSelect.value;

          // Reset all options in targetSelect
          Array.from(targetSelect.options).forEach(option => {
              option.disabled = false;
          });

          // Disable the selected option in the target select
          const targetOption = Array.from(targetSelect.options).find(
              option => option.value === selectedValue
          );
          if (targetOption) {
              targetOption.disabled = true;
          }

          // Adjust target select if its current value becomes disabled
          if (targetSelect.value === selectedValue) {
              targetSelect.value = ''; // Clear the selection
          }
      });
  }

  async function convertCurrency(event) {
      event.preventDefault(); 

      const currencyFrom = document.getElementById('currency-from').value;
      const currencyTo = document.getElementById('currency-to').value;
      const amount = parseFloat(document.getElementById('amount').value);

      if (!currencyFrom || !currencyTo || isNaN(amount)) {
          alert('Please select valid currencies and enter a valid amount.');
          return;
      }

      try {
          // Fetch conversion rates
          const response = await fetch(`${apiUrlConvert}?apikey=${apiKey}&base_currency=${currencyFrom}`);
          if (!response.ok) {
              throw new Error('Failed to fetch conversion rate');
          }

          const data = await response.json();
          const rates = data.data;

          if (!rates[currencyTo]) {
              alert('Conversion rate not available for selected currencies.');
              return;
          }

          // Perform the conversion
          const rate = rates[currencyTo];
          const convertedAmount = amount * rate;

          // Get the symbol of the target currency
          const currencyToSelect = document.getElementById('currency-to');
          const selectedOption = currencyToSelect.options[currencyToSelect.selectedIndex];
          const currencySymbol = selectedOption.dataset.symbol || '';

          // Display the result
          const resultElement = document.getElementById('result');
          resultElement.textContent = `${convertedAmount.toFixed(2)} ${currencySymbol}`;
      } catch (error) {
          console.error('Error during conversion:', error);
      }
  }

  // Populate dropdowns
  populateCurrencySelect(['currency-from', 'currency-to']);


  const currencyForm = document.getElementById('currency-form');
  currencyForm.addEventListener('submit', convertCurrency);
});







// live content
const apiKey = 'fca_live_FiQ6pQtQLHYcjkJsHAupBsn48JRGiC1vlDgDnu6Q'; 
const apiUrl = 'https://api.freecurrencyapi.com/v1/latest';

// Top 5 currencies 
const topCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD'];

// Fetch live rates
async function fetchLiveRates() {
    try {
        const response = await fetch(`${apiUrl}?apikey=${apiKey}`);
        if (!response.ok) {
            throw new Error('Failed to fetch rates');
        }
        const data = await response.json();
        const rates = data.data;

        displayRates(rates);
    } catch (error) {
        console.error('Error fetching live rates:', error);
        document.getElementById('error-message').classList.remove('hidden');
    }
}

// Display rates in the table
function displayRates(rates) {
    const tableBody = document.getElementById('currency-table-body');
    tableBody.innerHTML = ''; // Clear existing rows

    topCurrencies.forEach(currency => {
        if (rates[currency]) {
            const row = document.createElement('tr');
            row.className = 'border-b';

            row.innerHTML = `
                <td class="px-4 py-2">${currency}</td>
                <td class="px-4 py-2">${rates[currency].toFixed(4)}</td>
            `;

            tableBody.appendChild(row);
        }
    });
}

// Initialize the app
fetchLiveRates();

 
 document.addEventListener('DOMContentLoaded', async function () {
    const API_URL = 'https://api.polygon.io/v2/reference/news?category=crypto&apiKey=5cO7BgvQleyxCjJm7ZmvAUzmKtfHRuJW';
  
    async function fetchCryptoNews() {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
  

  
        if (!data || !data.results || data.results.length === 0) {
          console.error('No crypto news found.');
          return;
        }
  
        const news = data.results.slice(0, 4); // Get only the first 4 news articles
        console.log('First 4 news articles:', news);
  
        // Featured Article 
        const featured = news[0];
        document.getElementById('featured-image').src = featured.image_url || 'https://via.placeholder.com/400x200?text=No+Image';
        document.getElementById('featured-title').textContent = featured.title || 'No Title Available';
        document.getElementById('featured-content').textContent = featured.description || 'No description available.';
        document.getElementById('featured-link').href = featured.article_url || '#';
  
        // Small Articles (next 3 articles)
        const smallArticlesContainer = document.getElementById('small-articles-container');
        smallArticlesContainer.innerHTML = ''; 
  
        news.slice(1).forEach((article) => {
          const articleDiv = document.createElement('div');
          articleDiv.className = 'bg-white p-5 rounded-lg shadow-lg';
  
          const articleImage = article.image_url || 'https://via.placeholder.com/200x100?text=No+Image';
          const articleTitle = article.title || 'No Title Available';
          const articleSummary = article.description || 'No description available.';
          const articleUrl = article.article_url || '#';
  
          articleDiv.innerHTML = `
            <img src="${articleImage}" alt="Article Image" class="w-full h-32 object-cover rounded-lg mb-4">
            <h4 class="text-lg font-semibold mb-2">${articleTitle}</h4>
            <p class="text-gray-600 text-sm mb-4">${articleSummary}</p>
            <a href="${articleUrl}" class="text-blue-500 text-sm">Read more</a>
          `;
  
          smallArticlesContainer.appendChild(articleDiv);
        });
      } catch (error) {
        console.error('Error fetching crypto news:', error);
      }
    }
  
    fetchCryptoNews();
  });
  