'use strict';
import Harmonograph from './Harmonograph';
import { generatePendulumParams,PendulumParams } from './Harmonograph';

class HarmonographView {

  harmonograph: Harmonograph;
  ctx: CanvasRenderingContext2D;
  limit: number;
  t: number;
  canvas: HTMLCanvasElement;
  timerRef?: number;

  constructor(
    canvas: HTMLCanvasElement, 
    context: CanvasRenderingContext2D,
    xParams: PendulumParams[],
    yParams: PendulumParams[]
  ) {
    this.t = 1;
    this.limit = 20;
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

  draw() {
    // Reset if we get too large
    if(this.t > 1000) return this.stopAnimating();

    const width = this.canvas.width,
          height = this.canvas.height;
    this.ctx.clearRect(0, 0, width, height); 
    const cx = width/2;
    const cy = height/2;
    const size = Math.min(width, height);
    const scale = 0.5*size / 200; // The denominator changes the zoom factor 

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy);
    for(let i=0; i<this.t; i++) {
      // generate points
      const x = cx + scale * this.harmonograph.getX(i);
      const y = cy + scale * this.harmonograph.getY(i);
  
      this.ctx.lineTo(x, y);
    }

    const gradient = this.ctx.createRadialGradient(cx, cy, this.limit, cx, cy, size/2);
    gradient.addColorStop(0, 'rgba(10,20,200, 0.4)');
    gradient.addColorStop(0.7, 'rgba(200,100,15, 0.2)');
    this.ctx.strokeStyle = gradient;
    this.ctx.stroke();
  }

  animate() {
    this.t += 1;
    this.draw();
    console.log('Animating!')
    this.timerRef = requestAnimationFrame(() => this.animate());
  }

  stopAnimating() {
    if(this.timerRef != null) {
      window.cancelAnimationFrame(this.timerRef);
    }
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
  const xParams = [generatePendulumParams(1,0.5,70,0.001), generatePendulumParams(2,1,70,0.001)];
  const yParams = [generatePendulumParams(3,1.5,70,0.001), generatePendulumParams(4,2,70,0.001)];
  const harm = new HarmonographView(canvas, ctx, xParams, yParams);

  // window.addEventListener('mousemove', () => harm.animate(), false);
  window.addEventListener('resize', () => harm.resize(), false);
  harm.resize();

  // Easter Egg!
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).getHarmonographView = () => harm;
}

window.addEventListener('DOMContentLoaded', startHarmonograph);