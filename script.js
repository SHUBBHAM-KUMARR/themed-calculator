let currentExpression = '';
const inputDisplay = document.getElementById('inputDisplay');
const preview = document.getElementById('preview');
const historyList = document.getElementById('historyList');

function append(value) {
  currentExpression += value;
  inputDisplay.textContent = currentExpression;
  updatePreview();
}

function clearDisplay() {
  currentExpression = '';
  inputDisplay.textContent = '';
  preview.textContent = '';
}

function backspace() {
  currentExpression = currentExpression.slice(0, -1);
  inputDisplay.textContent = currentExpression;
  updatePreview();
}

function calculate() {
  const shown = currentExpression;
  const safeExpression = currentExpression.replace(/×/g, '*').replace(/÷/g, '/');
  try {
    const result = math.evaluate(safeExpression);
    currentExpression = result.toString();
    inputDisplay.textContent = currentExpression;
    preview.textContent = '';
    addHistoryEntry(`${shown} = ${result}`);
    saveHistory();
  } catch {
    preview.textContent = 'Invalid';
  }
}

function updatePreview() {
  const expr = currentExpression.replace(/×/g, '*').replace(/÷/g, '/');
  try {
    if (expr && /[0-9)]$/.test(expr)) {
      preview.textContent = math.evaluate(expr);
    } else {
      preview.textContent = '';
    }
  } catch {
    preview.textContent = '';
  }
}

function addHistoryEntry(text) {
  const entry = document.createElement('div');
  entry.className = 'history-entry';
  entry.textContent = text;
  historyList.prepend(entry);
}

function saveHistory() {
  const entries = Array.from(historyList.children).map(el => el.textContent);
  localStorage.setItem('calc-history', JSON.stringify(entries));
}

function loadHistory() {
  const saved = JSON.parse(localStorage.getItem('calc-history') || '[]');
  saved.forEach(addHistoryEntry);
}

function clearHistory() {
  historyList.innerHTML = '';
  localStorage.removeItem('calc-history');
}

document.querySelectorAll('.theme-switch input').forEach(input => {
  input.addEventListener('change', () => {
    document.body.className = input.id;
  });
});

window.onload = loadHistory;

window.addEventListener('keydown', (e) => {
  const key = e.key;
  if (!isNaN(key) || ['+', '-', '*', '/', '.', '(', ')'].includes(key)) {
    append(key === '*' ? '×' : key === '/' ? '÷' : key);
  } else if (key === 'Enter') {
    calculate();
  } else if (key === 'Backspace') {
    backspace();
  } else if (key === 'Escape') {
    clearDisplay();
  }
});
