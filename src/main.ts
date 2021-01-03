'use strict';
import { startHarmonograph } from './background';
// import TextTransition from './TextTransition';

/**
 * Adds dynamic information to the welcome blurb.
 */
function initializeWelcomeBlurb() {
  const greetings = ['Mabuhay', 'ようこそ', 'Bonjour', 'Welcome'];
  const age = (new Date()).getFullYear() - 1998;
  const location = 'Philippines';

  const ageEl = document.getElementById('curr-age');
  const locEl = document.getElementById('curr-loc');
  const welcomeEl = document.getElementById('welcome-msg');

  if (ageEl != null ) ageEl.textContent = age.toString();
  if (locEl != null ) locEl.textContent = location;
  if (welcomeEl != null ) {
    const ind = Math.round((greetings.length - 1) * Math.random());
    const greeting = greetings[ind];
    if (greeting != null) welcomeEl.textContent = greeting;
  }  
}

function main() {
  initializeWelcomeBlurb();
  startHarmonograph();
}

window.addEventListener('DOMContentLoaded', main, {once: true});