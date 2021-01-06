
class TextTransition {

  initializeElement(text: string): HTMLElement {
    const wrapperEl = document.createElement('span');
    wrapperEl.className = 'text-transition-word'; 
    for(const c of text) {
      const letterEl = document.createElement('span');
      letterEl.innerText = c;
      letterEl.className = 'text-transition-letter'; 
      wrapperEl.appendChild(letterEl);
    }
    return wrapperEl;
  }

  // transition(text: string): void {
  //   // TODO: implement this so it takes in text, 
  //   //  and an element and transitions with animation
  //   console.log(text);
    
  // }

}

export default TextTransition;