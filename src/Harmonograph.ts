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
    this.frequency = frequency;
    this.phase = phase;
    this.amplitude = amplitude;
    this.damping = halflife;
  }

  toRadians(v: number) {
    return v * Math.PI / 180;
  }

  getValue(t:number): number {
    return this.amplitude*Math.sin(t*this.frequency + this.phase)*Math.exp(-(this.damping*t));
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

  getX: (t: number) => number;
  getY: (t:number) => number;

  constructor(
    xParams: PendulumParams[], 
    yParams: PendulumParams[], 
    // rotating: PendulumParams?
  ) {
    const xPendulums = xParams.map(param => new Pendulum(param));
    const yPendulums = yParams.map(param => new Pendulum(param, Math.cos));

    this.getX = function(t) {
      const values = xPendulums.map(pend => pend.getValue(t));
      return values.reduce((val, sum) => val + sum);
    }

    this.getY = function(t) {
      const values = yPendulums.map(pend => pend.getValue(t));
      return values.reduce((val, sum) => val + sum);
    }
  }
}

export default Harmonograph;