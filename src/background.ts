'use strict';
import Harmonograph from './Harmonograph';
import { generatePendulumParams, PendulumParams } from './Harmonograph';

class HarmonographView {
  /**
   * Used to render the harmonograph on the canvas. 
   */

  limit = 20;
  t = 1;  // The timer for the current state of animation
  harmonograph: Harmonograph;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  timerRef?: NodeJS.Timeout;

  constructor(
    canvas: HTMLCanvasElement, 
    context: CanvasRenderingContext2D,
    xParams: PendulumParams[],
    yParams: PendulumParams[]
  ) {
    this.ctx = context;
    this.canvas = canvas;
    this.harmonograph = new Harmonograph(xParams, yParams);
  }

  // TODO: debounce
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.animate();
  }

  draw(t:number) {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const cx = width/2;
    const cy = height/2;
    const size = Math.min(width, height);
    const scale = 1.45*size / 1000; //Math.abs(200*Math.sin(0.0001*t)); // The denominator changes the zoom factor 
    
    // Drawing the points
    this.ctx.clearRect(0, 0, width, height); 
    this.ctx.beginPath();
    for(let i=1; i<t; i++) {
      const x = cx + scale * this.harmonograph.getX(i);
      const y = cy + scale * this.harmonograph.getY(i);
      if(i === 1) this.ctx.moveTo(cx, cy)
      else this.ctx.lineTo(x, y);
    }

    // Coloring
    const gradient = this.ctx.createRadialGradient(cx, cy, this.limit, cx, cy, size/2);
    gradient.addColorStop(0, 'rgba(10,20,200, 0.4)');
    gradient.addColorStop(0.7, 'rgba(200,100,15, 0.2)');
    this.ctx.strokeStyle = gradient;
    this.ctx.stroke();
  }

  animate() {
    this.t += 1;
    // Reset if we get too large
    if(this.t > 1000) this.stopAnimating();
    else {
      this.draw(this.t);
      this.timerRef = setTimeout(() => this.animate(), 100);
    }
  }

  stopAnimating() {
    if(this.timerRef != null) {
      window.clearTimeout(this.timerRef);
    }
  }

  save() {
    const link = document.createElement('a');
    link.download = 'background.png';
    link.href = this.canvas.toDataURL()
    link.click();
    link.remove();
  }
}

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
  const xParams = [generatePendulumParams(1.5,0.003,150,0.001), generatePendulumParams(1.5,0.0093,150,0.001)];
  const yParams = [generatePendulumParams(1,0.001,150,0.001), generatePendulumParams(1,0.0001,150,0.001)];
  const harm = new HarmonographView(canvas, ctx, xParams, yParams);

  window.addEventListener('resize', () => harm.resize(), false);
  harm.resize();

  // Easter Egg!
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).getHarmonographView = () => harm;
}

window.addEventListener('DOMContentLoaded', startHarmonograph);