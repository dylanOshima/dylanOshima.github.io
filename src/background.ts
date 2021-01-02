'use strict';
import Harmonograph from './Harmonograph';
import { generatePendulumParams, PendulumParams } from './Harmonograph';

class HarmonographView {
  /**
   * Used to render the harmonograph on the canvas. 
   */
  num_points = 10000
  limit = 20;
  t = 1;  // The timer for the current state of animation
  harmonograph: Harmonograph;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  timerRef?: number;

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
    const cx = width/8;
    const cy = height/8;
    const size = Math.min(width, height);
    const scale = 1.45*size / (800*Math.abs(Math.sin(0.0008*t + 2)) + 400); // The function dictates the dilation
    
    // Drawing the points
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.beginPath();
    for(let i=0; i<this.num_points; i++) {
      const x = cx + scale * this.harmonograph.getX(i, t);
      const y = cy + scale * this.harmonograph.getY(i, t);
      if(i <= 1) this.ctx.moveTo(cx, cy)
      else this.ctx.lineTo(x, y);
    }

    // Coloring
    const gradient = this.ctx.createRadialGradient(cx, cy, this.limit, cx, cy, size/2);
    gradient.addColorStop(0, '#833ab4');
    gradient.addColorStop(0.45, '#fd1d1d');
    gradient.addColorStop(1, '#fcb045');
    this.ctx.strokeStyle = gradient;
    this.ctx.globalAlpha = 0.3
    this.ctx.stroke();
  }

  animate() {
    if(this.timerRef != null) this.stopAnimating();

    this.t += 1;
    // Reset if we get too large
    if(this.t > this.num_points) this.stopAnimating();
    else {
      this.draw(this.t);
      this.timerRef = window.setTimeout(() => this.animate(), 1);
    }
  }

  stopAnimating() {
    if(this.timerRef != null) {
      window.clearTimeout(this.timerRef);
      this.timerRef == null;
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
  const xParams = [generatePendulumParams(-3,0.0101,320,0.0001), generatePendulumParams(2,0.0731,150,0.0001), generatePendulumParams(4.01,0.00134,200,0)];
  const yParams = [generatePendulumParams(-3,0.0101,100,0.0001), generatePendulumParams(2.01,0.0731,100,0.0001), generatePendulumParams(4,0.00134,200,0)];
  const harm = new HarmonographView(canvas, ctx, xParams, yParams);

  window.addEventListener('resize', () => harm.resize(), false);
  harm.resize();

  // Easter Egg!
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).getHarmonographView = () => harm;
}

window.addEventListener('DOMContentLoaded', startHarmonograph);