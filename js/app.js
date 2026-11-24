// Personaliza el nombre y el mensaje desde index.html.
const colors = ['#ff8eae', '#ffd36b', '#9fe3cf', '#bca0f5', '#ffad75'];
const lightsButton = document.querySelector('#lights');
const partyButton = document.querySelector('#party');
const card = document.querySelector('#card');
const intro = document.querySelector('#intro');
const envelope = document.querySelector('#envelope');

function say(text) {
  intro.classList.remove('show');
  window.setTimeout(() => {
    intro.textContent = text;
    intro.classList.add('show');
  }, 80);
}

// La historia empieza en la oscuridad y revela cada frase poco a poco.
window.setTimeout(() => say('¡Hey!'), 3000);
window.setTimeout(() => say('Está oscuro aquí...'), 7000);
window.setTimeout(() => {
  say('¿Puedes prender la luz?');
  lightsButton.hidden = false;
  document.querySelector('#hint').hidden = false;
}, 9000);

lightsButton.addEventListener('click', () => {
  document.body.classList.add('lights-on');
  intro.textContent = 'Hola Kamila, soy Traposito. Tengo algo para ti.';
  intro.classList.add('show');
  const hint = document.querySelector('#hint');
  hint.textContent = 'Toca el sobre para abrirlo.';
  hint.hidden = true;
  lightsButton.hidden = true;
  window.setTimeout(() => {
    envelope.hidden = false;
    hint.hidden = false;
  }, 2500);
});

envelope.addEventListener('click', () => {
  document.body.classList.add('show-letter');
  intro.textContent = '¡Sorpresa, Kamila!';
  card.classList.add('show');
  document.querySelector('#hint').hidden = true;
  partyButton.hidden = false;
});

partyButton.addEventListener('click', () => {
  document.querySelector('#hint').textContent = '¡Que todos tus deseos se hagan realidad! 🌟';
  for (let i = 0; i < 90; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.textContent = Math.random() > .5 ? '✦' : '●';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.color = colors[Math.floor(Math.random() * colors.length)];
    piece.style.fontSize = (9 + Math.random() * 15) + 'px';
    piece.style.animationDuration = (2.2 + Math.random() * 2.8) + 's';
    document.body.append(piece);
    piece.addEventListener('animationend', () => piece.remove(), { once:true });
  }
});
