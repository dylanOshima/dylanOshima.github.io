
(function() {
  // Initialize dynamic information
  const age = (new Date()).getFullYear() - 1998;
  const location = 'Philippines';

  const ageEl = document.getElementById('curr-age');
  const locEl = document.getElementById('curr-loc');
  
  if (ageEl != null ) ageEl.textContent = age.toString();
  if (locEl != null ) locEl.textContent = location;
})()
