/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Harmonograph.ts":
/*!*****************************!*\
  !*** ./src/Harmonograph.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generatePendulumParams = void 0;
function generatePendulumParams(frequency, phase, amplitude, halflife) {
    return {
        frequency: frequency,
        phase: phase,
        amplitude: amplitude,
        halflife: halflife
    };
}
exports.generatePendulumParams = generatePendulumParams;
var Pendulum = /** @class */ (function () {
    function Pendulum(options, func) {
        if (func === void 0) { func = Math.sin; }
        var frequency = options.frequency, phase = options.phase, amplitude = options.amplitude, halflife = options.halflife;
        this.func = func;
        this.frequency = this.toRadians(frequency);
        this.phase = phase;
        this.amplitude = amplitude;
        this.damping = halflife;
    }
    Object.defineProperty(Pendulum.prototype, "setFrequency", {
        set: function (f) {
            this.frequency = f;
        },
        enumerable: false,
        configurable: true
    });
    Pendulum.prototype.toRadians = function (v) {
        return v * Math.PI / 180;
    };
    Pendulum.prototype.getValue = function (i, t) {
        var phase = this.toRadians(t * this.phase);
        return this.amplitude * Math.sin(i * this.frequency + phase) * Math.exp(-(this.damping * i));
    };
    return Pendulum;
}());
var Harmonograph = /** @class */ (function () {
    function Harmonograph(xParams, yParams) {
        var xPendulums = xParams.map(function (param) { return new Pendulum(param); });
        var yPendulums = yParams.map(function (param) { return new Pendulum(param, Math.cos); });
        this.getX = function (i, t) {
            var values = xPendulums.map(function (pend) { return pend.getValue(i, t); });
            return values.reduce(function (val, sum) { return val + sum; });
        };
        this.getY = function (i, t) {
            var values = yPendulums.map(function (pend) { return pend.getValue(i, t); });
            return values.reduce(function (val, sum) { return val + sum; });
        };
    }
    return Harmonograph;
}());
exports.default = Harmonograph;


/***/ }),

/***/ "./src/background.ts":
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.startHarmonograph = void 0;
var Harmonograph_1 = __importDefault(__webpack_require__(/*! ./Harmonograph */ "./src/Harmonograph.ts"));
var Harmonograph_2 = __webpack_require__(/*! ./Harmonograph */ "./src/Harmonograph.ts");
var HarmonographView = /** @class */ (function () {
    function HarmonographView(canvas, context, xParams, yParams) {
        /**
         * Used to render the harmonograph on the canvas.
         */
        this.num_points = 10000;
        this.limit = 20;
        this.t = 1; // The timer for the current state of animation
        this.ctx = context;
        this.canvas = canvas;
        this.harmonograph = new Harmonograph_1.default(xParams, yParams);
    }
    // TODO: debounce
    HarmonographView.prototype.resize = function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.animate();
    };
    HarmonographView.prototype.draw = function (t) {
        var width = this.canvas.width;
        var height = this.canvas.height;
        var cx = width / 8;
        var cy = height / 8;
        var size = Math.min(width, height);
        var scale = 1.45 * size / (800 * Math.abs(Math.sin(0.0008 * t + 2)) + 400); // The function dictates the dilation
        // Drawing the points
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.beginPath();
        for (var i = 0; i < this.num_points; i++) {
            var x = cx + scale * this.harmonograph.getX(i, t);
            var y = cy + scale * this.harmonograph.getY(i, t);
            if (i <= 1)
                this.ctx.moveTo(cx, cy);
            else
                this.ctx.lineTo(x, y);
        }
        // Coloring
        var gradient = this.ctx.createRadialGradient(cx, cy, this.limit, cx, cy, size / 2);
        gradient.addColorStop(0, '#833ab4');
        gradient.addColorStop(0.45, '#fd1d1d');
        gradient.addColorStop(1, '#fcb045');
        this.ctx.strokeStyle = gradient;
        this.ctx.globalAlpha = 0.3;
        this.ctx.stroke();
    };
    HarmonographView.prototype.animate = function () {
        var _this = this;
        if (this.timerRef != null)
            this.stopAnimating();
        this.t += 1;
        // Reset if we get too large
        if (this.t > this.num_points)
            this.stopAnimating();
        else {
            this.draw(this.t);
            this.timerRef = window.setTimeout(function () { return _this.animate(); }, 1);
        }
    };
    HarmonographView.prototype.stopAnimating = function () {
        if (this.timerRef != null) {
            window.clearTimeout(this.timerRef);
            this.timerRef == null;
        }
    };
    HarmonographView.prototype.save = function () {
        var link = document.createElement('a');
        link.download = 'background.png';
        link.href = this.canvas.toDataURL();
        link.click();
        link.remove();
    };
    return HarmonographView;
}());
function startHarmonograph() {
    // Fetch Canvas element
    var canvas = document.getElementById('background');
    if (canvas.getContext == null) {
        return;
    }
    // Get the context of the canvas
    var ctx = canvas.getContext('2d');
    if (ctx == null) {
        return;
    }
    // Initialize variables
    var xParams = [Harmonograph_2.generatePendulumParams(-3, 0.0101, 320, 0.0001), Harmonograph_2.generatePendulumParams(2, 0.0731, 150, 0.0001), Harmonograph_2.generatePendulumParams(4.01, 0.00134, 200, 0)];
    var yParams = [Harmonograph_2.generatePendulumParams(-3, 0.0101, 100, 0.0001), Harmonograph_2.generatePendulumParams(2.01, 0.0731, 100, 0.0001), Harmonograph_2.generatePendulumParams(4, 0.00134, 200, 0)];
    var harm = new HarmonographView(canvas, ctx, xParams, yParams);
    window.addEventListener('resize', function () { return harm.resize(); }, false);
    harm.resize();
    // Easter Egg!
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.getHarmonographView = function () { return harm; };
}
exports.startHarmonograph = startHarmonograph;


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var background_1 = __webpack_require__(/*! ./background */ "./src/background.ts");
// import TextTransition from './TextTransition';
/**
 * Adds dynamic information to the welcome blurb.
 */
function initializeWelcomeBlurb() {
    var greetings = ['Mabuhay', 'ようこそ', 'Bonjour', 'Welcome'];
    var age = (new Date()).getFullYear() - 1998;
    var location = 'Philippines';
    var ageEl = document.getElementById('curr-age');
    var locEl = document.getElementById('curr-loc');
    var welcomeEl = document.getElementById('welcome-msg');
    if (ageEl != null)
        ageEl.textContent = age.toString();
    if (locEl != null)
        locEl.textContent = location;
    if (welcomeEl != null) {
        var ind = Math.round((greetings.length - 1) * Math.random());
        var greeting = greetings[ind];
        if (greeting != null)
            welcomeEl.textContent = greeting;
    }
}
function main() {
    initializeWelcomeBlurb();
    background_1.startHarmonograph();
}
window.addEventListener('DOMContentLoaded', main, { once: true });


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/main.ts");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wZXJzb25hbF9zaXRlLy4vc3JjL0hhcm1vbm9ncmFwaC50cyIsIndlYnBhY2s6Ly9wZXJzb25hbF9zaXRlLy4vc3JjL2JhY2tncm91bmQudHMiLCJ3ZWJwYWNrOi8vcGVyc29uYWxfc2l0ZS8uL3NyYy9tYWluLnRzIiwid2VicGFjazovL3BlcnNvbmFsX3NpdGUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcGVyc29uYWxfc2l0ZS93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhOzs7QUFTYixTQUFnQixzQkFBc0IsQ0FBQyxTQUFnQixFQUFFLEtBQVksRUFBRSxTQUFnQixFQUFFLFFBQWU7SUFDdEcsT0FBTztRQUNMLFNBQVM7UUFDVCxLQUFLO1FBQ0wsU0FBUztRQUNULFFBQVE7S0FDVDtBQUNILENBQUM7QUFQRCx3REFPQztBQUVEO0lBT0Usa0JBQVksT0FBdUIsRUFBRSxJQUFlO1FBQWYsOEJBQU8sSUFBSSxDQUFDLEdBQUc7UUFDMUMsYUFBUyxHQUFpQyxPQUFPLFVBQXhDLEVBQUUsS0FBSyxHQUEwQixPQUFPLE1BQWpDLEVBQUUsU0FBUyxHQUFlLE9BQU8sVUFBdEIsRUFBRSxRQUFRLEdBQUssT0FBTyxTQUFaLENBQWE7UUFDMUQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDO0lBQzFCLENBQUM7SUFFRCxzQkFBSSxrQ0FBWTthQUFoQixVQUFpQixDQUFTO1lBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLENBQUM7OztPQUFBO0lBRUQs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QUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNoQyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNsQyxJQUFNLEVBQUUsR0FBRyxLQUFLLEdBQUMsQ0FBQyxDQUFDO1FBQ25CLElBQU0sRUFBRSxHQUFHLE1BQU0sR0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDckMsSUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMscUNBQXFDO1FBRTdHLHFCQUFxQjtRQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3JCLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25DLElBQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3BELElBQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3BELElBQUcsQ0FBQyxJQUFJLENBQUM7Z0JBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQzs7Z0JBQzdCLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUM1QjtRQUVELFdBQVc7UUFDWCxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksR0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRixRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNwQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN2QyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUM7UUFDaEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsR0FBRztRQUMxQixJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxrQ0FBTyxHQUFQO1FBQUEsaUJBVUM7UUFUQyxJQUFHLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSTtZQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUUvQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNaLDRCQUE0QjtRQUM1QixJQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVU7WUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7YUFDN0M7WUFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsY0FBTSxZQUFJLENBQUMsT0FBTyxFQUFFLEVBQWQsQ0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzVEO0lBQ0gsQ0FBQztJQUVELHdDQUFhLEdBQWI7UUFDRSxJQUFHLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxFQUFFO1lBQ3hCLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDO1NBQ3ZCO0lBQ0gsQ0FBQztJQUVELCtCQUFJLEdBQUo7UUFDRSxJQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxRQUFRLEdBQUcsZ0JBQWdCLENBQUM7UUFDakMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtRQUNuQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUNILHVCQUFDO0FBQUQsQ0FBQztBQUVELFNBQWdCLGlCQUFpQjtJQUMvQix1QkFBdUI7SUFDdkIsSUFBTSxNQUFNLEdBQXVCLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7SUFFekUsSUFBRyxNQUFNLENBQUMsVUFBVSxJQUFJLElBQUksRUFBRTtRQUM1QixPQUFPO0tBQ1I7SUFDRCxnQ0FBZ0M7SUFDaEMsSUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQyxJQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUU7UUFDZCxPQUFPO0tBQ1I7SUFFRCx1QkFBdUI7SUFDdkIsSUFBTSxPQUFPLEdBQUcsQ0FBQyxxQ0FBc0IsQ0FBQyxDQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsR0FBRyxFQUFDLE1BQU0sQ0FBQyxFQUFFLHFDQUFzQixDQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsR0FBRyxFQUFDLE1BQU0sQ0FBQyxFQUFFLHFDQUFzQixDQUFDLElBQUksRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEosSUFBTSxPQUFPLEdBQUcsQ0FBQyxxQ0FBc0IsQ0FBQyxDQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsR0FBRyxFQUFDLE1BQU0sQ0FBQyxFQUFFLHFDQUFzQixDQUFDLElBQUksRUFBQyxNQUFNLEVBQUMsR0FBRyxFQUFDLE1BQU0sQ0FBQyxFQUFFLHFDQUFzQixDQUFDLENBQUMsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEosSUFBTSxJQUFJLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUVqRSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLGNBQU0sV0FBSSxDQUFDLE1BQU0sRUFBRSxFQUFiLENBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM5RCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFFZCxjQUFjO0lBQ2QsOERBQThEO0lBQzdELE1BQWMsQ0FBQyxtQkFBbUIsR0FBRyxjQUFNLFdBQUksRUFBSixDQUFJLENBQUM7QUFDbkQsQ0FBQztBQXhCRCw4Q0F3QkM7Ozs7Ozs7Ozs7O0FDbEhZOztBQUNiLGtGQUFpRDtBQUNqRCxpREFBaUQ7QUFFakQ7O0dBRUc7QUFDSCxTQUFTLHNCQUFzQjtJQUM3QixJQUFNLFNBQVMsR0FBRyxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzVELElBQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQztJQUM5QyxJQUFNLFFBQVEsR0FBRyxhQUFhLENBQUM7SUFFL0IsSUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsRCxJQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2xELElBQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUM7SUFFekQsSUFBSSxLQUFLLElBQUksSUFBSTtRQUFHLEtBQUssQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3ZELElBQUksS0FBSyxJQUFJLElBQUk7UUFBRyxLQUFLLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQztJQUNqRCxJQUFJLFNBQVMsSUFBSSxJQUFJLEVBQUc7UUFDdEIsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDL0QsSUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLElBQUksUUFBUSxJQUFJLElBQUk7WUFBRSxTQUFTLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQztLQUN4RDtBQUNILENBQUM7QUFFRCxTQUFTLElBQUk7SUFDWCxzQkFBc0IsRUFBRSxDQUFDO0lBQ3pCLDhCQUFpQixFQUFFLENBQUM7QUFDdEIsQ0FBQztBQUVELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQzs7Ozs7OztVQzlCaEU7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7OztVQ3JCQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCB0eXBlIFBlbmR1bHVtUGFyYW1zID0ge1xuICBmcmVxdWVuY3k6IG51bWJlcixcbiAgcGhhc2U6IG51bWJlcixcbiAgYW1wbGl0dWRlOiBudW1iZXIsXG4gIGhhbGZsaWZlOiBudW1iZXJcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlUGVuZHVsdW1QYXJhbXMoZnJlcXVlbmN5Om51bWJlciwgcGhhc2U6bnVtYmVyLCBhbXBsaXR1ZGU6bnVtYmVyLCBoYWxmbGlmZTpudW1iZXIpOiBQZW5kdWx1bVBhcmFtcyB7XG4gIHJldHVybiB7XG4gICAgZnJlcXVlbmN5LFxuICAgIHBoYXNlLFxuICAgIGFtcGxpdHVkZSxcbiAgICBoYWxmbGlmZSBcbiAgfSBcbn1cblxuY2xhc3MgUGVuZHVsdW0ge1xuICBmdW5jOiAoeDogbnVtYmVyKSA9PiBudW1iZXI7XG4gIGZyZXF1ZW5jeTogbnVtYmVyO1xuICBwaGFzZTogbnVtYmVyO1xuICBhbXBsaXR1ZGU6IG51bWJlcjtcbiAgZGFtcGluZzogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IFBlbmR1bHVtUGFyYW1zLCBmdW5jID0gTWF0aC5zaW4pIHtcbiAgICBjb25zdCB7IGZyZXF1ZW5jeSwgcGhhc2UsIGFtcGxpdHVkZSwgaGFsZmxpZmUgfSA9IG9wdGlvbnM7XG4gICAgdGhpcy5mdW5jID0gZnVuYztcbiAgICB0aGlzLmZyZXF1ZW5jeSA9IHRoaXMudG9SYWRpYW5zKGZyZXF1ZW5jeSk7XG4gICAgdGhpcy5waGFzZSA9IHBoYXNlO1xuICAgIHRoaXMuYW1wbGl0dWRlID0gYW1wbGl0dWRlO1xuICAgIHRoaXMuZGFtcGluZyA9IGhhbGZsaWZlO1xuICB9XG5cbiAgc2V0IHNldEZyZXF1ZW5jeShmOiBudW1iZXIpIHtcbiAgICB0aGlzLmZyZXF1ZW5jeSA9IGY7XG4gIH1cblxuICB0b1JhZGlhbnModjogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHYgKiBNYXRoLlBJIC8gMTgwO1xuICB9XG5cbiAgZ2V0VmFsdWUoaTpudW1iZXIsIHQ6bnVtYmVyKTogbnVtYmVyIHtcbiAgICBjb25zdCBwaGFzZSA9IHRoaXMudG9SYWRpYW5zKHQgKiB0aGlzLnBoYXNlKTtcbiAgICByZXR1cm4gdGhpcy5hbXBsaXR1ZGUgKiBNYXRoLnNpbihpICogdGhpcy5mcmVxdWVuY3kgKyBwaGFzZSkqTWF0aC5leHAoLSh0aGlzLmRhbXBpbmcqaSkpO1xuICB9XG59XG5cbmNsYXNzIEhhcm1vbm9ncmFwaCB7XG4gIC8qKlxuICAgKiBBIGhhcm1vbm9ncmFwaCBjcmVhdGVzIGl0cyBmaWd1cmVzIHVzaW5nIHRoZSBtb3ZlbWVudHMgb2YgZGFtcGVkIHBlbmR1bHVtcy4gVGhlIG1vdmVtZW50IG9mIGEgZGFtcGVkIHBlbmR1bHVtIGlzIGRlc2NyaWJlZCBieSB0aGUgZXF1YXRpb25cbiAgICogeCh0KT1BKnNpbih0ZitwKWVeey1kdH1cbiAgICogaW4gd2hpY2g6XG4gICAqICAgZiByZXByZXNlbnRzIGZyZXF1ZW5jeSxcbiAgICogICBwIHJlcHJlc2VudHMgcGhhc2UsXG4gICAqICAgQSByZXByZXNlbnRzIGFtcGxpdHVkZSxcbiAgICogICBkIHJlcHJlc2VudHMgZGFtcGluZ1xuICAgKiAgIHQgcmVwcmVzZW50cyB0aW1lLlxuICAgKi9cblxuICBnZXRYOiAoaTogbnVtYmVyLCB0OiBudW1iZXIpID0+IG51bWJlcjtcbiAgZ2V0WTogKGk6IG51bWJlciwgdDpudW1iZXIpID0+IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICB4UGFyYW1zOiBQZW5kdWx1bVBhcmFtc1tdLCBcbiAgICB5UGFyYW1zOiBQZW5kdWx1bVBhcmFtc1tdLCBcbiAgICAvLyByb3RhdGluZzogUGVuZHVsdW1QYXJhbXM/XG4gICkge1xuICAgIGNvbnN0IHhQZW5kdWx1bXMgPSB4UGFyYW1zLm1hcChwYXJhbSA9PiBuZXcgUGVuZHVsdW0ocGFyYW0pKTtcbiAgICBjb25zdCB5UGVuZHVsdW1zID0geVBhcmFtcy5tYXAocGFyYW0gPT4gbmV3IFBlbmR1bHVtKHBhcmFtLCBNYXRoLmNvcykpO1xuXG4gICAgdGhpcy5nZXRYID0gZnVuY3Rpb24oaSwgdCkge1xuICAgICAgY29uc3QgdmFsdWVzID0geFBlbmR1bHVtcy5tYXAocGVuZCA9PiBwZW5kLmdldFZhbHVlKGksIHQpKTtcbiAgICAgIHJldHVybiB2YWx1ZXMucmVkdWNlKCh2YWwsIHN1bSkgPT4gdmFsICsgc3VtKTtcbiAgICB9XG5cbiAgICB0aGlzLmdldFkgPSBmdW5jdGlvbihpLCB0KSB7XG4gICAgICBjb25zdCB2YWx1ZXMgPSB5UGVuZHVsdW1zLm1hcChwZW5kID0+IHBlbmQuZ2V0VmFsdWUoaSwgdCkpO1xuICAgICAgcmV0dXJuIHZhbHVlcy5yZWR1Y2UoKHZhbCwgc3VtKSA9PiB2YWwgKyBzdW0pO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBIYXJtb25vZ3JhcGg7IiwiJ3VzZSBzdHJpY3QnO1xuaW1wb3J0IEhhcm1vbm9ncmFwaCBmcm9tICcuL0hhcm1vbm9ncmFwaCc7XG5pbXBvcnQgeyBnZW5lcmF0ZVBlbmR1bHVtUGFyYW1zLCBQZW5kdWx1bVBhcmFtcyB9IGZyb20gJy4vSGFybW9ub2dyYXBoJztcblxuY2xhc3MgSGFybW9ub2dyYXBoVmlldyB7XG4gIC8qKlxuICAgKiBVc2VkIHRvIHJlbmRlciB0aGUgaGFybW9ub2dyYXBoIG9uIHRoZSBjYW52YXMuIFxuICAgKi9cbiAgbnVtX3BvaW50cyA9IDEwMDAwXG4gIGxpbWl0ID0gMjA7XG4gIHQgPSAxOyAgLy8gVGhlIHRpbWVyIGZvciB0aGUgY3VycmVudCBzdGF0ZSBvZiBhbmltYXRpb25cbiAgaGFybW9ub2dyYXBoOiBIYXJtb25vZ3JhcGg7XG4gIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xuICB0aW1lclJlZj86IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBcbiAgICBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgeFBhcmFtczogUGVuZHVsdW1QYXJhbXNbXSxcbiAgICB5UGFyYW1zOiBQZW5kdWx1bVBhcmFtc1tdXG4gICkge1xuICAgIHRoaXMuY3R4ID0gY29udGV4dDtcbiAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcbiAgICB0aGlzLmhhcm1vbm9ncmFwaCA9IG5ldyBIYXJtb25vZ3JhcGgoeFBhcmFtcywgeVBhcmFtcyk7XG4gIH1cblxuICAvLyBUT0RPOiBkZWJvdW5jZVxuICByZXNpemUoKSB7XG4gICAgdGhpcy5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgdGhpcy5hbmltYXRlKCk7XG4gIH1cblxuICBkcmF3KHQ6bnVtYmVyKSB7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLmNhbnZhcy53aWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHQ7XG4gICAgY29uc3QgY3ggPSB3aWR0aC84O1xuICAgIGNvbnN0IGN5ID0gaGVpZ2h0Lzg7XG4gICAgY29uc3Qgc2l6ZSA9IE1hdGgubWluKHdpZHRoLCBoZWlnaHQpO1xuICAgIGNvbnN0IHNjYWxlID0gMS40NSpzaXplIC8gKDgwMCpNYXRoLmFicyhNYXRoLnNpbigwLjAwMDgqdCArIDIpKSArIDQwMCk7IC8vIFRoZSBmdW5jdGlvbiBkaWN0YXRlcyB0aGUgZGlsYXRpb25cbiAgICBcbiAgICAvLyBEcmF3aW5nIHRoZSBwb2ludHNcbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgZm9yKGxldCBpPTA7IGk8dGhpcy5udW1fcG9pbnRzOyBpKyspIHtcbiAgICAgIGNvbnN0IHggPSBjeCArIHNjYWxlICogdGhpcy5oYXJtb25vZ3JhcGguZ2V0WChpLCB0KTtcbiAgICAgIGNvbnN0IHkgPSBjeSArIHNjYWxlICogdGhpcy5oYXJtb25vZ3JhcGguZ2V0WShpLCB0KTtcbiAgICAgIGlmKGkgPD0gMSkgdGhpcy5jdHgubW92ZVRvKGN4LCBjeSlcbiAgICAgIGVsc2UgdGhpcy5jdHgubGluZVRvKHgsIHkpO1xuICAgIH1cblxuICAgIC8vIENvbG9yaW5nXG4gICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLmN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudChjeCwgY3ksIHRoaXMubGltaXQsIGN4LCBjeSwgc2l6ZS8yKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJyM4MzNhYjQnKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC40NSwgJyNmZDFkMWQnKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJyNmY2IwNDUnKTtcbiAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGdyYWRpZW50O1xuICAgIHRoaXMuY3R4Lmdsb2JhbEFscGhhID0gMC4zXG4gICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gIH1cblxuICBhbmltYXRlKCkge1xuICAgIGlmKHRoaXMudGltZXJSZWYgIT0gbnVsbCkgdGhpcy5zdG9wQW5pbWF0aW5nKCk7XG5cbiAgICB0aGlzLnQgKz0gMTtcbiAgICAvLyBSZXNldCBpZiB3ZSBnZXQgdG9vIGxhcmdlXG4gICAgaWYodGhpcy50ID4gdGhpcy5udW1fcG9pbnRzKSB0aGlzLnN0b3BBbmltYXRpbmcoKTtcbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuZHJhdyh0aGlzLnQpO1xuICAgICAgdGhpcy50aW1lclJlZiA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHRoaXMuYW5pbWF0ZSgpLCAxKTtcbiAgICB9XG4gIH1cblxuICBzdG9wQW5pbWF0aW5nKCkge1xuICAgIGlmKHRoaXMudGltZXJSZWYgIT0gbnVsbCkge1xuICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLnRpbWVyUmVmKTtcbiAgICAgIHRoaXMudGltZXJSZWYgPT0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBzYXZlKCkge1xuICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgbGluay5kb3dubG9hZCA9ICdiYWNrZ3JvdW5kLnBuZyc7XG4gICAgbGluay5ocmVmID0gdGhpcy5jYW52YXMudG9EYXRhVVJMKClcbiAgICBsaW5rLmNsaWNrKCk7XG4gICAgbGluay5yZW1vdmUoKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRIYXJtb25vZ3JhcGgoKTp2b2lkIHtcbiAgLy8gRmV0Y2ggQ2FudmFzIGVsZW1lbnRcbiAgY29uc3QgY2FudmFzID0gPEhUTUxDYW52YXNFbGVtZW50PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja2dyb3VuZCcpO1xuXG4gIGlmKGNhbnZhcy5nZXRDb250ZXh0ID09IG51bGwpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gR2V0IHRoZSBjb250ZXh0IG9mIHRoZSBjYW52YXNcbiAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gIGlmKGN0eCA9PSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gSW5pdGlhbGl6ZSB2YXJpYWJsZXNcbiAgY29uc3QgeFBhcmFtcyA9IFtnZW5lcmF0ZVBlbmR1bHVtUGFyYW1zKC0zLDAuMDEwMSwzMjAsMC4wMDAxKSwgZ2VuZXJhdGVQZW5kdWx1bVBhcmFtcygyLDAuMDczMSwxNTAsMC4wMDAxKSwgZ2VuZXJhdGVQZW5kdWx1bVBhcmFtcyg0LjAxLDAuMDAxMzQsMjAwLDApXTtcbiAgY29uc3QgeVBhcmFtcyA9IFtnZW5lcmF0ZVBlbmR1bHVtUGFyYW1zKC0zLDAuMDEwMSwxMDAsMC4wMDAxKSwgZ2VuZXJhdGVQZW5kdWx1bVBhcmFtcygyLjAxLDAuMDczMSwxMDAsMC4wMDAxKSwgZ2VuZXJhdGVQZW5kdWx1bVBhcmFtcyg0LDAuMDAxMzQsMjAwLDApXTtcbiAgY29uc3QgaGFybSA9IG5ldyBIYXJtb25vZ3JhcGhWaWV3KGNhbnZhcywgY3R4LCB4UGFyYW1zLCB5UGFyYW1zKTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4gaGFybS5yZXNpemUoKSwgZmFsc2UpO1xuICBoYXJtLnJlc2l6ZSgpO1xuXG4gIC8vIEVhc3RlciBFZ2chXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICh3aW5kb3cgYXMgYW55KS5nZXRIYXJtb25vZ3JhcGhWaWV3ID0gKCkgPT4gaGFybTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcbmltcG9ydCB7IHN0YXJ0SGFybW9ub2dyYXBoIH0gZnJvbSAnLi9iYWNrZ3JvdW5kJztcbi8vIGltcG9ydCBUZXh0VHJhbnNpdGlvbiBmcm9tICcuL1RleHRUcmFuc2l0aW9uJztcblxuLyoqXG4gKiBBZGRzIGR5bmFtaWMgaW5mb3JtYXRpb24gdG8gdGhlIHdlbGNvbWUgYmx1cmIuXG4gKi9cbmZ1bmN0aW9uIGluaXRpYWxpemVXZWxjb21lQmx1cmIoKSB7XG4gIGNvbnN0IGdyZWV0aW5ncyA9IFsnTWFidWhheScsICfjgojjgYbjgZPjgZ0nLCAnQm9uam91cicsICdXZWxjb21lJ107XG4gIGNvbnN0IGFnZSA9IChuZXcgRGF0ZSgpKS5nZXRGdWxsWWVhcigpIC0gMTk5ODtcbiAgY29uc3QgbG9jYXRpb24gPSAnUGhpbGlwcGluZXMnO1xuXG4gIGNvbnN0IGFnZUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1cnItYWdlJyk7XG4gIGNvbnN0IGxvY0VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1cnItbG9jJyk7XG4gIGNvbnN0IHdlbGNvbWVFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWxjb21lLW1zZycpO1xuXG4gIGlmIChhZ2VFbCAhPSBudWxsICkgYWdlRWwudGV4dENvbnRlbnQgPSBhZ2UudG9TdHJpbmcoKTtcbiAgaWYgKGxvY0VsICE9IG51bGwgKSBsb2NFbC50ZXh0Q29udGVudCA9IGxvY2F0aW9uO1xuICBpZiAod2VsY29tZUVsICE9IG51bGwgKSB7XG4gICAgY29uc3QgaW5kID0gTWF0aC5yb3VuZCgoZ3JlZXRpbmdzLmxlbmd0aCAtIDEpICogTWF0aC5yYW5kb20oKSk7XG4gICAgY29uc3QgZ3JlZXRpbmcgPSBncmVldGluZ3NbaW5kXTtcbiAgICBpZiAoZ3JlZXRpbmcgIT0gbnVsbCkgd2VsY29tZUVsLnRleHRDb250ZW50ID0gZ3JlZXRpbmc7XG4gIH0gIFxufVxuXG5mdW5jdGlvbiBtYWluKCkge1xuICBpbml0aWFsaXplV2VsY29tZUJsdXJiKCk7XG4gIHN0YXJ0SGFybW9ub2dyYXBoKCk7XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgbWFpbiwge29uY2U6IHRydWV9KTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvbWFpbi50c1wiKTtcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ2V4cG9ydHMnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbiJdLCJzb3VyY2VSb290IjoiIn0=