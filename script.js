let totalQuestions = 0;
let answers = [];
let review = [];
let filter = 'all';

const container = document.getElementById('questions');
const app = document.getElementById('app');
const startScreen = document.getElementById('startScreen');

/* Progress Ring */
const radius = 30;
const circumference = 2 * Math.PI * radius;
const ring = document.querySelector('.ring-progress');
ring.style.strokeDasharray = circumference;

/* ---------- START TEST ---------- */
function startTest(count) {
  totalQuestions = count;
  initTest();
}

function startCustom() {
  const val = parseInt(document.getElementById('customCount').value);
  if (val > 0) startTest(val);
}

function initTest() {
  answers = Array(totalQuestions).fill(null);
  review = Array(totalQuestions).fill(false);
  startScreen.style.display = 'none';
  app.style.display = 'block';
  render();
}

/* ---------- RENDER ---------- */
function render() {
  container.innerHTML = "";

  answers.forEach((ans, i) => {
    if (
      filter === 'attempted' && ans === null ||
      filter === 'unattempted' && ans !== null ||
      filter === 'review' && !review[i]
    ) return;

    const q = document.createElement('div');
    q.className = 'question';

    q.innerHTML = `
      <div class="q-head">
        <strong>Question ${i + 1}</strong>
        <button class="review-btn ${review[i] ? 'active' : ''}"
          onclick="toggleReview(${i})">
          MARK FOR REVIEW
        </button>
      </div>
      <div class="options">
        ${['A','B','C','D'].map(o => `
          <div class="option ${ans === o ? 'selected' : ''}"
            onclick="selectOption(${i}, '${o}')">${o}</div>
        `).join('')}
      </div>
    `;
    container.appendChild(q);
  });

  updateStatus();
}

/* ---------- ACTIONS ---------- */
function selectOption(q, option) {
  answers[q] = answers[q] === option ? null : option;
  render();
}

function toggleReview(q) {
  review[q] = !review[q];
  render();
}

/* ---------- STATUS ---------- */
function updateStatus() {
  const attempted = answers.filter(a => a !== null).length;
  const reviewCount = review.filter(r => r).length;
  const percent = Math.round((attempted / totalQuestions) * 100);

  document.getElementById('attempted').innerText = attempted;
  document.getElementById('unattempted').innerText =
    totalQuestions - attempted;
  document.getElementById('reviewCount').innerText = reviewCount;

  const offset = circumference - (percent / 100) * circumference;
  ring.style.strokeDashoffset = offset;
  document.getElementById('progressText').innerText = percent + "%";
}

/* ---------- FILTER ---------- */
function setFilter(f, btn) {
  filter = f;
  document.querySelectorAll('.filters button')
    .forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  render();
}
