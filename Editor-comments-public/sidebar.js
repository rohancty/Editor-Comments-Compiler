const termsSelect = document.getElementById('terms');
const addBtn = document.getElementById('addBtn');
const copyBtn = document.getElementById('copyBtn');
const selectedList = document.getElementById('selectedList');
const copiedContentArea = document.getElementById('copiedContent');

let selectedTerms = [];

// Load terms from texts.txt
fetch(chrome.runtime.getURL('texts.txt'))
  .then(response => response.text())
  .then(text => {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l);
    for (const line of lines) {
      const option = document.createElement('option');
      option.value = line;
      option.textContent = line;
      document.getElementById('terms').appendChild(option);
    }
  });

// Add selected term
document.getElementById('addBtn').addEventListener('click', () => {
  const term = document.getElementById('terms').value;
  if (!term) {
    alert('Please select a term.');
    return;
  }
  selectedTerms.push(term);
  updateList();
});

// Update list display
function updateList() {
  const list = document.getElementById('selectedList');
  list.innerHTML = '';
  selectedTerms.forEach((term, index) => {
    const li = document.createElement('li');
    // Show numbered list item
    li.textContent = `${index + 1}. ${term}`;

    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.title = 'Remove this term';
    removeBtn.onclick = () => {
      selectedTerms.splice(index, 1);
      updateList();
    };
    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

// Copy with "Editor comments:" prefix
document.getElementById('copyBtn').addEventListener('click', () => {
  if (selectedTerms.length === 0) {
    alert('No terms selected.');
    return;
  }
  const formatted = formatTerms(selectedTerms);
  const finalText = `Editor comments:\n${formatted}`;
  navigator.clipboard.writeText(finalText).then(() => {
    document.getElementById('copiedContent').value = finalText;
  });
});

// Format list
function formatTerms(terms) {
  return terms.map((t, i) => `${i + 1}. ${t}\n`).join('\n\n');
}

// Clear All button handler
document.getElementById('clearBtn').addEventListener('click', () => {
  selectedTerms = [];
  updateList();
  document.getElementById('copiedContent').value = '';
});