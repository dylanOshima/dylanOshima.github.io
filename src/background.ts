'use strict';
import Harmonograph from './Harmonograph';
import { generatePendulumParams,PendulumParams } from './Harmonograph';

class HarmonographView {

  harmonograph: Harmonograph;
  ctx: CanvasRenderingContext2D;
  limit: number;
  canvas: HTMLCanvasElement;

  constructor(
    canvas: HTMLCanvasElement, 
    context: CanvasRenderingContext2D,
    xParams: PendulumParams[],
    yParams: PendulumParams[]
  ) {
    this.limit = 20;
    this.ctx = context;
    this.canvas = canvas;
    this.harmonograph = new Harmonograph(xParams, yParams);
  }

  // TODO: debounce
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.draw();
  }

  draw() {
    const cx = this.canvas.width/2;
    const cy = this.canvas.height/2;
    const size = Math.min(this.canvas.width, this.canvas.height);
    const scale = 1*size / 200; // The denominator changes the zoom factor 

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy);
    for(let i=0; i<500; i++) {
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

  window.addEventListener('resize', harm.resize, false);
  harm.resize();
}

window.addEventListener('DOMContentLoaded', startHarmonograph);