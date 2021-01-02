'use strict';

export type PendulumParams = {
  frequency: number,
  phase: number,
  amplitude: number,
  halflife: number
}

export function generatePendulumParams(frequency:number, phase:number, amplitude:number, halflife:number): PendulumParams {
  return {
    frequency,
    phase,
    amplitude,
    halflife 
  } 
}

class Pendulum {
  func: (x: number) => number;
  frequency: number;
  phase: number;
  amplitude: number;
  damping: number;

  constructor(options: PendulumParams, func = Math.sin) {
    const { frequency, phase, amplitude, halflife } = options;
    this.func = func;
    this.frequency = this.toRadians(frequency);
    this.phase = phase;
    this.amplitude = amplitude;
    this.damping = halflife;
  }

  set setFrequency(f: number) {
    this.frequency = f;
  }

  toRadians(v: number) {
    return v * Math.PI / 180;
  }

  getValue(i:number, t:number): number {
    const phase = this.toRadians(t * this.phase);
    return this.amplitude * Math.sin(i * this.frequency + phase)*Math.exp(-(this.damping*i));
  }
}

class Harmonograph {
  /**
   * A harmonograph creates its figures using the movements of damped pendulums. The movement of a damped pendulum is described by the equation
   * x(t)=A*sin(tf+p)e^{-dt}
   * in which:
   *   f represents frequency,
   *   p represents phase,
   *   A represents amplitude,
   *   d represents damping
   *   t represents time.
   */

  getX: (i: number, t: number) => number;
  getY: (i: number, t:number) => number;

  constructor(
    xParams: PendulumParams[], 
    yParams: PendulumParams[], 
    // rotating: PendulumParams?
  ) {
    const xPendulums = xParams.map(param => new Pendulum(param));
    const yPendulums = yParams.map(param => new Pendulum(param, Math.cos));

    this.getX = function(i, t) {
      const values = xPendulums.map(pend => pend.getValue(i, t));
      return values.reduce((val, sum) => val + sum);
    }

    this.getY = function(i, t) {
      const values = yPendulums.map(pend => pend.getValue(i, t));
      return values.reduce((val, sum) => val + sum);
    }
  }
}

export default Harmonograph;