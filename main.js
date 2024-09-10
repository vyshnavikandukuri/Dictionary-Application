const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultContainer = document.getElementById('result-container');
const wordTitle = document.getElementById('wordTitle');
const wordDescription = document.getElementById('wordDescription');
const audioButton = document.getElementById('audioButton');

// Event listener for search button click
searchButton.addEventListener('click', () => {
  search();
});

// Event listener for pressing "Enter" key
searchInput.addEventListener('keyup', (event) => {
  if (event.key === "Enter") {
    search();
  }
});

// Search function
function search() {
  const searchTerm = searchInput.value.trim();
  if (searchTerm === "") {
    alert('Please enter a word to search...');
    return;
  }
  fetchDictionaryData(searchTerm);
}

// Fetch dictionary data from API
async function fetchDictionaryData(searchTerm) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`);
    if (!response.ok) {
      throw new Error("Failed to fetch the data");
    }

    const data = await response.json();
    displayResult(data);
  } catch (error) {
    console.error(error);
    alert('An error occurred while fetching the data.');
  }
}

// Display the fetched result
function displayResult(data) {
  resultContainer.style.display = 'block';

  const wordData = data[0];
  wordTitle.textContent = wordData.word;

  // Check if there are definitions and meanings
  if (wordData.meanings && wordData.meanings.length > 0) {
    wordDescription.innerHTML = `
      <ul>
        ${wordData.meanings.map(meaning => `
          <li>
            <p><strong>Part of Speech:</strong> ${meaning.partOfSpeech}</p>
            <p><strong>Definition:</strong> ${meaning.definitions[0].definition}</p>
          </li>
        `).join('')}
      </ul>
    `;
  } else {
    wordDescription.innerHTML = `<p>No definitions found.</p>`;
  }

  // Display and activate the audio button if there is a pronunciation available
  if (wordData.phonetics && wordData.phonetics.length > 0 && wordData.phonetics[0].audio) {
    audioButton.style.display = 'inline-block';
    audioButton.onclick = () => {
      const audio = new Audio(wordData.phonetics[0].audio);
      audio.play();
    };
  } else {
    audioButton.style.display = 'none'; // Hide if no audio available
  }
}

// Audio button functionality for text-to-speech
audioButton.addEventListener("click", () => {
  const searchTerm = searchInput.value.trim();

  if (searchTerm === "") {
    alert('Please enter a word to speak...');
    return;
  }

  speak(searchTerm);
});

// Speak function using SpeechSynthesis API
function speak(word) {
  const speech = new SpeechSynthesisUtterance(word);
  speech.lang = 'en-US';
  speech.volume = 1; // Volume ranges from 0 to 1
  speech.rate = 1;   // Rate ranges from 0.1 to 10
  speech.pitch = 1;  // Pitch ranges from 0 to 2
  window.speechSynthesis.speak(speech);
}
