const chapters = [
  {
    id: '2.1',
    title: 'Kapitel 2.1 – Andragradsekvationer',
    topics: ['Kvadratkomplettering', 'Lösningsformeln (abc-formeln)', 'Tillämpningar och problemlösning', 'Rotekvationer'],
  },
  {
    id: '2.2',
    title: 'Kapitel 2.2 – Andragradsfunktioner',
    topics: ['Repetition av funktioner', 'Andragradsfunktionens graf', 'Största och minsta värde', 'Från graf till formel', 'Tillämpningar'],
  },
  {
    id: '2.3',
    title: 'Kapitel 2.3 – Exponentialfunktioner och logaritmer',
    topics: ['Exponentialekvationer', 'Logaritmer', 'Logaritmlagar'],
  },
  {
    id: '2.4',
    title: 'Kapitel 2.4 – Exponentialekvationer och potensekvationer',
    topics: ['Tillämpningar och problemlösning'],
  },
  { id: '2.5', title: 'Kapitel 2.5 – Regressionsanalys', topics: ['Regressionsanalys'] },
];

const state = {
  mode: 'practice',
  chapterId: '2.1',
  questionsByChapter: {},
  solved: new Set(),
  wrongQueue: [],
  score: 0,
  correct: 0,
  wrong: 0,
  currentQuestion: null,
  chapterIndexMap: {},
  testSecondsLeft: 20 * 60,
  timer: null,
};

const $ = (id) => document.getElementById(id);

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function approxEqual(a, b, eps = 0.01) { return Math.abs(Number(a) - Number(b)) <= eps; }

function makeQuestionBase(chapterId, idx, type, difficulty, text, answer, explanation, hint, options) {
  return {
    id: `${chapterId}-${idx}`,
    chapterId,
    type,
    difficulty,
    text,
    answer,
    explanation,
    hint,
    options,
  };
}

function buildChapter21() {
  const q = [];
  let i = 1;
  for (let k = 0; k < 16; k++) {
    const a = randInt(1, 4), b = randInt(-12, 12), c = randInt(-10, 10);
    const text = `Lös ekvationen med kvadratkomplettering: ${a}x² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)} = 0`;
    const disc = b * b - 4 * a * c;
    const ans = disc < 0 ? 'Inga reella rötter' : `${((-b + Math.sqrt(disc)) / (2 * a)).toFixed(2)}, ${((-b - Math.sqrt(disc)) / (2 * a)).toFixed(2)}`;
    q.push(makeQuestionBase('2.1', i++, 'Räkneuppgift', 'medel', text, ans, `1) Flytta konstanten. 2) Dela med ${a}. 3) Addera (b/2a)^2. 4) Rotutdrag och lös x.`, 'Börja med att dividera så koefficienten framför x² blir 1.'));
  }
  for (let k = 0; k < 12; k++) {
    const x1 = randInt(-6, 6), x2 = randInt(-6, 6), a = randInt(1, 3);
    const b = -a * (x1 + x2), c = a * x1 * x2;
    const text = `Använd abc-formeln för att lösa: ${a}x² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)} = 0`;
    q.push(makeQuestionBase('2.1', i++, 'Räkneuppgift', k % 3 === 0 ? 'svår/provnivå' : 'lätt', text, `${x1.toFixed(2)}, ${x2.toFixed(2)}`, 'Sätt in a, b, c i x = (-b ± √(b²-4ac))/2a och förenkla.', 'Diskriminanten avgör antalet rötter.'));
  }
  for (let k = 0; k < 8; k++) {
    const a = randInt(2, 9);
    const text = `Vilken ekvation motsvarar rot-ekvationen √(x + ${a}) = ${randInt(2, 6)}?`;
    const rhs = randInt(2, 6);
    const right = `x + ${a} = ${rhs ** 2}`;
    const opts = shuffle([right, `x + ${a} = ${rhs}`, `x - ${a} = ${rhs ** 2}`, `x + ${a ** 2} = ${rhs ** 2}`]);
    q.push(makeQuestionBase('2.1', i++, 'Flervalsfråga', 'lätt', text, right, 'Kvadrera båda led: (√(...))² = (...)².', 'Kom ihåg att kvadrering tar bort roten.', opts));
  }
  while (q.length < 40) {
    const v = randInt(5, 30);
    q.push(makeQuestionBase('2.1', i++, 'Textproblem', 'svår/provnivå', `En boll kastas uppåt: h(t)=-5t²+${v}t+2. När når den marken? (s)`, 'Använd andragradsekvation', 'Sätt h(t)=0 och använd abc-formeln. Välj positiv tid.', 'Marken motsvarar h=0.'));
  }
  return shuffle(q);
}

function buildChapter22() {
  const q = [];
  let i = 1;
  for (let k = 0; k < 18; k++) {
    const a = randInt(-3, 3) || 1, b = randInt(-6, 6), c = randInt(-8, 8);
    const xv = (-b / (2 * a)).toFixed(2);
    const yv = (a * (xv ** 2) + b * xv + c).toFixed(2);
    q.push(makeQuestionBase('2.2', i++, 'Räkneuppgift', 'medel', `Bestäm vertex för f(x)=${a}x² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)}.`, `(${xv}, ${yv})`, 'Använd x = -b/(2a). Beräkna sedan y-värdet genom insättning.', 'Vertexens x-koordinat ges direkt av -b/2a.'));
  }
  for (let k = 0; k < 12; k++) {
    const a = randInt(1, 4), h = randInt(-4, 4), k2 = randInt(-4, 8);
    const text = `Vilken form har en parabel med vertex (${h}, ${k2}) och öppnar ${a > 0 ? 'uppåt' : 'nedåt'}?`;
    const right = `f(x)=${a}(x-${h})²+${k2}`;
    const opts = shuffle([right, `f(x)=(x-${h})²+${a}`, `f(x)=${a}(x+${h})²-${k2}`, `f(x)=x²+${h}x+${k2}`]);
    q.push(makeQuestionBase('2.2', i++, 'Flervalsfråga', 'lätt', text, right, 'Använd vertexformeln f(x)=a(x-h)²+k.', 'Titta på tecknet i (x-h).', opts));
  }
  while (q.length < 40) {
    q.push(makeQuestionBase('2.2', i++, 'Textproblem', 'svår/provnivå', 'Designa en rektangel med maximal area där omkretsen är 40 m. Beskriv med andragradsfunktion och ange max area.', '100', 'A(x)=x(20-x)=-x²+20x. Vertex ger max vid x=10 => area 100.', 'Skriv arean som funktion av en sida.'));
  }
  return shuffle(q);
}

function buildChapter23() {
  const q = [];
  let i = 1;
  for (let k = 0; k < 16; k++) {
    const a = randInt(2, 5), x = randInt(1, 6), val = a ** x;
    q.push(makeQuestionBase('2.3', i++, 'Räkneuppgift', 'lätt', `Lös ${a}^x = ${val}`, `${x}`, 'Samma bas på båda sidor => exponenterna lika.', 'Skriv högerledet som potens med basen.'));
  }
  for (let k = 0; k < 14; k++) {
    const n = randInt(2, 200);
    q.push(makeQuestionBase('2.3', i++, 'Räkneuppgift', 'medel', `Beräkna log10(${n}). Avrunda till två decimaler.`, `${Math.log10(n).toFixed(2)}`, 'Använd logaritmknappen eller definitionen 10^x=n.', 'log10 anger exponenten till basen 10.'));
  }
  while (q.length < 40) {
    const text = 'Vilken logaritmlag är korrekt?';
    const right = 'log(a·b)=log(a)+log(b)';
    const options = shuffle([right, 'log(a+b)=log(a)+log(b)', 'log(a/b)=log(a)·log(b)', 'log(a^n)=n+log(a)']);
    q.push(makeQuestionBase('2.3', i++, 'Flervalsfråga', 'svår/provnivå', text, right, 'Produktregeln: log av produkt blir summa av logaritmer.', 'Tänk: multiplikation ute blir addition inne i log-världen.', options));
  }
  return shuffle(q);
}

function buildChapter24() {
  const q = [];
  let i = 1;
  for (let k = 0; k < 25; k++) {
    const a = randInt(2, 6), b = randInt(2, 4), x = randInt(1, 5), val = (a ** x) * b;
    q.push(makeQuestionBase('2.4', i++, 'Räkneuppgift', k % 2 ? 'medel' : 'lätt', `Lös ${b}·${a}^x = ${val}`, `${x}`, 'Dividera först med konstanten och ta sedan logaritm eller jämför potenser.', 'Isolera exponentialtermen först.'));
  }
  while (q.length < 40) {
    const p = randInt(2, 5), x = randInt(2, 5), val = x ** p;
    q.push(makeQuestionBase('2.4', i++, 'Textproblem', 'svår/provnivå', `Lös potensekvationen x^${p} = ${val} i reella tal.`, `${x}${p % 2 === 0 ? `, ${-x}` : ''}`, 'Ta p:te roten. Vid jämn exponent finns ofta två rötter ±.', 'Jämn eller udda exponent påverkar antalet lösningar.'));
  }
  return shuffle(q);
}

function buildChapter25() {
  const q = [];
  let i = 1;
  for (let k = 0; k < 20; k++) {
    const m = randInt(1, 8), b = randInt(-5, 8), x = randInt(0, 10);
    q.push(makeQuestionBase('2.5', i++, 'Räkneuppgift', 'lätt', `I en linjär regression y=${m}x+${b}. Vad blir y när x=${x}?`, `${m * x + b}`, 'Sätt in x-värdet i regressionslinjen.', 'Använd modellen direkt: y = kx + m.'));
  }
  for (let k = 0; k < 10; k++) {
    const right = 'Residual = observerat värde - modellens värde';
    const options = shuffle([right, 'Residual = modellens värde / observerat värde', 'Residual = medelvärdet av x', 'Residual = lutningen i modellen']);
    q.push(makeQuestionBase('2.5', i++, 'Flervalsfråga', 'medel', 'Vad beskriver en residual i regressionsanalys?', right, 'Residualer visar avvikelsen mellan data och modell.', 'Tänk: skillnaden mellan verklighet och förutsägelse.', options));
  }
  while (q.length < 40) {
    q.push(makeQuestionBase('2.5', i++, 'Textproblem', 'svår/provnivå', 'Ett dataset har starkt positivt samband. Vilken regression passar oftast bättre: stigande linjär eller fallande linjär?', 'stigande linjär', 'Positivt samband betyder att y ökar när x ökar.', 'Rita punkterna mentalt: går de uppåt åt höger?'));
  }
  return shuffle(q);
}

function buildAllQuestions() {
  state.questionsByChapter['2.1'] = buildChapter21();
  state.questionsByChapter['2.2'] = buildChapter22();
  state.questionsByChapter['2.3'] = buildChapter23();
  state.questionsByChapter['2.4'] = buildChapter24();
  state.questionsByChapter['2.5'] = buildChapter25();
}

function renderTabs() {
  const tabs = $('chapterTabs');
  tabs.innerHTML = '';
  chapters.forEach((ch, idx) => {
    state.chapterIndexMap[ch.id] = idx;
    const b = document.createElement('button');
    b.className = `btn ${state.chapterId === ch.id ? 'active' : ''}`;
    b.textContent = ch.title;
    b.onclick = () => {
      state.chapterId = ch.id;
      renderTabs();
      pickQuestion();
      renderChapterStats();
      updateProgress();
    };
    tabs.appendChild(b);
  });
}

function randomQuestion(chapterId) {
  const chapterQuestions = state.questionsByChapter[chapterId];
  return chapterQuestions[randInt(0, chapterQuestions.length - 1)];
}

function pickQuestion(preferred = null) {
  state.currentQuestion = preferred || randomQuestion(state.chapterId);
  const q = state.currentQuestion;
  $('questionTitle').textContent = `Fråga (${q.id})`;
  $('questionType').textContent = q.type;
  $('questionDifficulty').textContent = q.difficulty;
  $('questionText').textContent = q.text;
  $('feedback').textContent = '';
  $('feedback').className = 'feedback';
  $('solution').innerHTML = '';

  const area = $('answerArea');
  area.innerHTML = '';
  if (q.type === 'Flervalsfråga') {
    const sel = document.createElement('select');
    sel.id = 'answerInput';
    sel.innerHTML = '<option value="">Välj ett svar...</option>' + q.options.map((o) => `<option>${o}</option>`).join('');
    area.appendChild(sel);
  } else {
    const input = document.createElement('input');
    input.id = 'answerInput';
    input.type = 'text';
    input.placeholder = 'Skriv ditt svar här';
    area.appendChild(input);
  }

  const chapter = chapters.find((c) => c.id === state.chapterId);
  $('chapterMeta').textContent = `Delar: ${chapter.topics.join(' • ')}`;
}

function renderChapterStats() {
  const ul = $('chapterStats');
  ul.innerHTML = '';
  chapters.forEach((ch) => {
    const qids = state.questionsByChapter[ch.id].map((q) => q.id);
    const solved = qids.filter((id) => state.solved.has(id)).length;
    const li = document.createElement('li');
    li.textContent = `${ch.id}: ${solved}/${qids.length} (${Math.round((solved / qids.length) * 100)}%)`;
    ul.appendChild(li);
  });
}

function updateScoreboard() {
  $('score').textContent = state.score;
  $('correctCount').textContent = state.correct;
  $('wrongCount').textContent = state.wrong;
  const total = Object.values(state.questionsByChapter).reduce((acc, arr) => acc + arr.length, 0);
  $('solvedCount').textContent = state.solved.size;
  $('totalCount').textContent = total;
}

function updateProgress() {
  const qids = state.questionsByChapter[state.chapterId].map((q) => q.id);
  const solved = qids.filter((id) => state.solved.has(id)).length;
  const percent = Math.round((solved / qids.length) * 100);
  $('chapterProgress').value = percent;
  $('chapterProgressText').textContent = `${percent}%`;
}

function parseUserAnswer(value) {
  return (value || '').trim().toLowerCase().replace(',', '.');
}

function isCorrect(user, right) {
  const u = parseUserAnswer(user);
  const r = parseUserAnswer(right);
  if (r.includes(',')) {
    const vals = r.split(',').map((x) => parseFloat(x));
    const userVals = u.split(',').map((x) => parseFloat(x));
    if (vals.length !== userVals.length) return false;
    return vals.every((v) => userVals.some((uv) => approxEqual(uv, v)));
  }
  const rn = parseFloat(r), un = parseFloat(u);
  if (!Number.isNaN(rn) && !Number.isNaN(un)) return approxEqual(un, rn);
  return u === r;
}

function submitAnswer() {
  const q = state.currentQuestion;
  const user = $('answerInput').value;
  const ok = isCorrect(user, q.answer);
  const feedback = $('feedback');
  feedback.className = `feedback ${ok ? 'good' : 'bad'}`;
  feedback.textContent = ok ? '✅ Rätt svar!' : '❌ Inte riktigt, försök förstå lösningen.';

  if (ok) {
    state.correct += 1;
    state.score += q.difficulty === 'svår/provnivå' ? 5 : q.difficulty === 'medel' ? 3 : 2;
    state.solved.add(q.id);
  } else {
    state.wrong += 1;
    state.score = Math.max(0, state.score - 1);
    state.wrongQueue.push(q);
  }

  $('solution').innerHTML = `<strong>Rätt svar:</strong> ${q.answer}<br><strong>Steg-för-steg:</strong> ${q.explanation}`;
  updateScoreboard();
  updateProgress();
  renderChapterStats();
}

function showHint() {
  $('solution').innerHTML = `<strong>Hint:</strong> ${state.currentQuestion.hint}`;
}

function setMode(mode) {
  state.mode = mode;
  $('studyModeBtn').classList.toggle('active', mode === 'practice');
  $('testModeBtn').classList.toggle('active', mode === 'test');
  if (state.timer) clearInterval(state.timer);
  if (mode === 'test') {
    state.testSecondsLeft = 20 * 60;
    state.timer = setInterval(() => {
      state.testSecondsLeft -= 1;
      if (state.testSecondsLeft <= 0) {
        clearInterval(state.timer);
        $('timer').textContent = '00:00';
        $('submitBtn').disabled = true;
        $('feedback').textContent = 'Tiden är slut! Byt till övningsläge för att fortsätta.';
      }
      const m = String(Math.max(0, Math.floor(state.testSecondsLeft / 60))).padStart(2, '0');
      const s = String(Math.max(0, state.testSecondsLeft % 60)).padStart(2, '0');
      $('timer').textContent = `${m}:${s}`;
    }, 1000);
  } else {
    $('timer').textContent = '--:--';
    $('submitBtn').disabled = false;
  }
}

function initTheme() {
  $('modeToggle').onclick = () => {
    document.body.classList.toggle('dark');
    $('modeToggle').textContent = document.body.classList.contains('dark') ? '☀️ Ljust läge' : '🌙 Mörkt läge';
    drawGraph();
  };
}

function drawGraph() {
  const canvas = $('graphCanvas');
  const ctx = canvas.getContext('2d');
  const a = Number($('coefA').value), b = Number($('coefB').value), c = Number($('coefC').value);
  $('formulaDisplay').textContent = `f(x) = ${a}x² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)}`;

  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const axisColor = getComputedStyle(document.body).getPropertyValue('--muted');
  const lineColor = getComputedStyle(document.body).getPropertyValue('--primary');
  ctx.strokeStyle = axisColor;
  ctx.beginPath();
  ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
  ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h);
  ctx.stroke();

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let px = 0; px < w; px++) {
    const x = (px - w / 2) / 20;
    const y = a * x * x + b * x + c;
    const py = h / 2 - y * 20;
    if (px === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
}

function init() {
  buildAllQuestions();
  renderTabs();
  updateScoreboard();
  renderChapterStats();
  updateProgress();
  pickQuestion();
  initTheme();

  $('submitBtn').onclick = submitAnswer;
  $('nextBtn').onclick = () => pickQuestion();
  $('hintBtn').onclick = showHint;
  $('retryWrongBtn').onclick = () => {
    if (!state.wrongQueue.length) {
      $('feedback').textContent = 'Inga felaktiga frågor ännu!';
      return;
    }
    pickQuestion(state.wrongQueue.shift());
  };

  $('studyModeBtn').onclick = () => setMode('practice');
  $('testModeBtn').onclick = () => setMode('test');
  ['coefA', 'coefB', 'coefC'].forEach((id) => $(id).addEventListener('input', drawGraph));
  drawGraph();
}

init();
