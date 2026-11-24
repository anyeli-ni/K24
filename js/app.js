const lightsButton = document.querySelector('#lights');
const partyButton = document.querySelector('#party');
const card = document.querySelector('#card');
const intro = document.querySelector('#intro');
const envelope = document.querySelector('#envelope');
const invitation = document.querySelector('#invitation');
const yesButton = document.querySelector('#yes');
const noButton = document.querySelector('#no');
const hint = document.querySelector('#hint');
const room = document.querySelector('.room');
const dedications = document.querySelector('#dedications');
const flowers = document.querySelector('#flowers');

function say(text) {
  intro.classList.remove('show');
  window.setTimeout(() => {
    intro.textContent = text;
    intro.classList.add('show');
  }, 80);
}

window.setTimeout(() => say('\u00a1Hey!'), 3000);
window.setTimeout(() => say('Est\u00e1 oscuro aqu\u00ed...'), 7000);
window.setTimeout(() => {
  say('\u00bfPuedes prender la luz?');
  lightsButton.hidden = false;
  hint.hidden = false;
}, 9000);

lightsButton.addEventListener('click', () => {
  document.body.classList.add('lights-on');
  say('Hola Kamila, soy Traposito.');
  hint.hidden = true;
  lightsButton.hidden = true;
  window.setTimeout(() => {
    say('Hay una carta para ti, \u00bfquieres leerla?');
    invitation.hidden = false;
  }, 3000);
});

function moveNoButton() {
  const margin = 12;
  const maxX = Math.max(margin, window.innerWidth - noButton.offsetWidth - margin);
  const maxY = Math.max(margin, window.innerHeight - noButton.offsetHeight - margin);
  noButton.style.position = 'fixed';
  noButton.style.left = `${margin + Math.random() * (maxX - margin)}px`;
  noButton.style.top = `${margin + Math.random() * (maxY - margin)}px`;
  noButton.style.zIndex = '5';
}

noButton.addEventListener('pointerenter', moveNoButton);
noButton.addEventListener('pointerdown', (event) => {
  event.preventDefault();
  moveNoButton();
});
noButton.addEventListener('click', moveNoButton);
window.addEventListener('resize', () => {
  if (noButton.style.position === 'fixed') moveNoButton();
});

yesButton.addEventListener('click', () => {
  invitation.hidden = true;
  envelope.hidden = false;
  hint.textContent = 'Toca la carta para abrirla.';
  hint.hidden = false;
});

envelope.addEventListener('click', () => {
  document.body.classList.add('show-letter');
  intro.textContent = '';
  intro.classList.remove('show');
  card.classList.add('show');
  hint.hidden = true;
  partyButton.hidden = false;
});

partyButton.addEventListener('click', () => {
  document.body.classList.remove('lights-on', 'show-letter');
  document.body.classList.add('dedication-mode');
  room.hidden = true;
  dedications.hidden = false;
  window.scrollTo({ top:0, behavior:'smooth' });
});

document.querySelector('#flowers-button').addEventListener('click', () => {
  document.body.classList.remove('dedication-mode');
  document.body.classList.add('flower-mode');
  dedications.hidden = true;
  flowers.hidden = false;
  window.scrollTo({ top:0, behavior:'smooth' });
  window.setTimeout(() => flowers.classList.add('open'), 80);
});
