'use strict';
import Harmonograph from './Harmonograph';
import { generatePendulumParams } from './Harmonograph';

function startHarmonograph() {
  // Fetch Canvas element
  const canvas = <HTMLCanvasElement> document.getElementById('background');

  if(canvas.getContext == null) {
    return;
  }
  // Get the context of the canvas
  const ctx = canvas.getContext('2d');
  if(ctx == null) {
    return;
  }

  // Initialize variables
  const xParams = [generatePendulumParams(1,0.5,70,0.001), generatePendulumParams(2,1,70,0.001)];
  const yParams = [generatePendulumParams(3,1.5,70,0.001), generatePendulumParams(4,2,70,0.001)];
  const harmonograph = new Harmonograph(xParams, yParams);
  const limit = 20;

  // Begin drawing
  const draw = () => {
    const cx = canvas.width/2;
    const cy = canvas.height/2;
    const size = Math.min(canvas.width, canvas.height);
    const scale = 1*size / 200; // The denominator changes the zoom factor

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    for(let i=0; i<1000; i++) {
      // generate points
      const x = cx+scale*harmonograph.getX(i);
      const y = cy+scale*harmonograph.getY(i);
  
      ctx.lineTo(x, y);
    }
    const gradient = ctx.createRadialGradient(cx, cy, limit, cx, cy, size/2);
    gradient.addColorStop(0, 'rgba(10,20,200, 0.4)');
    gradient.addColorStop(0.7, 'rgba(200,100,15, 0.2)');
    ctx.strokeStyle = gradient;
    ctx.stroke();
  }

  // TODO: debounce
  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
  }
  window.addEventListener('resize', onResize, false);
  onResize();
}

window.addEventListener('DOMContentLoaded', startHarmonograph);