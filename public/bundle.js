/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/styles.css":
/*!************************!*\
  !*** ./src/styles.css ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

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
__webpack_require__(/*! ./styles.css */ "./src/styles.css");
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
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/main.ts");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wZXJzb25hbF9zaXRlLy4vc3JjL3N0eWxlcy5jc3M/MTU1MyIsIndlYnBhY2s6Ly9wZXJzb25hbF9zaXRlLy4vc3JjL0hhcm1vbm9ncmFwaC50cyIsIndlYnBhY2s6Ly9wZXJzb25hbF9zaXRlLy4vc3JjL2JhY2tncm91bmQudHMiLCJ3ZWJwYWNrOi8vcGVyc29uYWxfc2l0ZS8uL3NyYy9tYWluLnRzIiwid2VicGFjazovL3BlcnNvbmFsX3NpdGUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcGVyc29uYWxfc2l0ZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3BlcnNvbmFsX3NpdGUvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7O0FDQWE7OztBQVNiLFNBQWdCLHNCQUFzQixDQUFDLFNBQWdCLEVBQUUsS0FBWSxFQUFFLFNBQWdCLEVBQUUsUUFBZTtJQUN0RyxPQUFPO1FBQ0wsU0FBUztRQUNULEtBQUs7UUFDTCxTQUFTO1FBQ1QsUUFBUTtLQUNUO0FBQ0gsQ0FBQztBQVBELHdEQU9DO0FBRUQ7SUFPRSxrQkFBWSxPQUF1QixFQUFFLElBQWU7UUFBZiw4QkFBTyxJQUFJLENBQUMsR0FBRztRQUMxQyxhQUFTLEdBQWlDLE9BQU8sVUFBeEMsRUFBRSxLQUFLLEdBQTBCLE9BQU8sTUFBakMsRUFBRSxTQUFTLEdBQWUsT0FBTyxVQUF0QixFQUFFLFFBQVEsR0FBSyxPQUFPLFNBQVosQ0FBYTtRQUMxRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxD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IjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgdHlwZSBQZW5kdWx1bVBhcmFtcyA9IHtcbiAgZnJlcXVlbmN5OiBudW1iZXIsXG4gIHBoYXNlOiBudW1iZXIsXG4gIGFtcGxpdHVkZTogbnVtYmVyLFxuICBoYWxmbGlmZTogbnVtYmVyXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVBlbmR1bHVtUGFyYW1zKGZyZXF1ZW5jeTpudW1iZXIsIHBoYXNlOm51bWJlciwgYW1wbGl0dWRlOm51bWJlciwgaGFsZmxpZmU6bnVtYmVyKTogUGVuZHVsdW1QYXJhbXMge1xuICByZXR1cm4ge1xuICAgIGZyZXF1ZW5jeSxcbiAgICBwaGFzZSxcbiAgICBhbXBsaXR1ZGUsXG4gICAgaGFsZmxpZmUgXG4gIH0gXG59XG5cbmNsYXNzIFBlbmR1bHVtIHtcbiAgZnVuYzogKHg6IG51bWJlcikgPT4gbnVtYmVyO1xuICBmcmVxdWVuY3k6IG51bWJlcjtcbiAgcGhhc2U6IG51bWJlcjtcbiAgYW1wbGl0dWRlOiBudW1iZXI7XG4gIGRhbXBpbmc6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBQZW5kdWx1bVBhcmFtcywgZnVuYyA9IE1hdGguc2luKSB7XG4gICAgY29uc3QgeyBmcmVxdWVuY3ksIHBoYXNlLCBhbXBsaXR1ZGUsIGhhbGZsaWZlIH0gPSBvcHRpb25zO1xuICAgIHRoaXMuZnVuYyA9IGZ1bmM7XG4gICAgdGhpcy5mcmVxdWVuY3kgPSB0aGlzLnRvUmFkaWFucyhmcmVxdWVuY3kpO1xuICAgIHRoaXMucGhhc2UgPSBwaGFzZTtcbiAgICB0aGlzLmFtcGxpdHVkZSA9IGFtcGxpdHVkZTtcbiAgICB0aGlzLmRhbXBpbmcgPSBoYWxmbGlmZTtcbiAgfVxuXG4gIHNldCBzZXRGcmVxdWVuY3koZjogbnVtYmVyKSB7XG4gICAgdGhpcy5mcmVxdWVuY3kgPSBmO1xuICB9XG5cbiAgdG9SYWRpYW5zKHY6IG51bWJlcikge1xuICAgIHJldHVybiB2ICogTWF0aC5QSSAvIDE4MDtcbiAgfVxuXG4gIGdldFZhbHVlKGk6bnVtYmVyLCB0Om51bWJlcik6IG51bWJlciB7XG4gICAgY29uc3QgcGhhc2UgPSB0aGlzLnRvUmFkaWFucyh0ICogdGhpcy5waGFzZSk7XG4gICAgcmV0dXJuIHRoaXMuYW1wbGl0dWRlICogTWF0aC5zaW4oaSAqIHRoaXMuZnJlcXVlbmN5ICsgcGhhc2UpKk1hdGguZXhwKC0odGhpcy5kYW1waW5nKmkpKTtcbiAgfVxufVxuXG5jbGFzcyBIYXJtb25vZ3JhcGgge1xuICAvKipcbiAgICogQSBoYXJtb25vZ3JhcGggY3JlYXRlcyBpdHMgZmlndXJlcyB1c2luZyB0aGUgbW92ZW1lbnRzIG9mIGRhbXBlZCBwZW5kdWx1bXMuIFRoZSBtb3ZlbWVudCBvZiBhIGRhbXBlZCBwZW5kdWx1bSBpcyBkZXNjcmliZWQgYnkgdGhlIGVxdWF0aW9uXG4gICAqIHgodCk9QSpzaW4odGYrcCllXnstZHR9XG4gICAqIGluIHdoaWNoOlxuICAgKiAgIGYgcmVwcmVzZW50cyBmcmVxdWVuY3ksXG4gICAqICAgcCByZXByZXNlbnRzIHBoYXNlLFxuICAgKiAgIEEgcmVwcmVzZW50cyBhbXBsaXR1ZGUsXG4gICAqICAgZCByZXByZXNlbnRzIGRhbXBpbmdcbiAgICogICB0IHJlcHJlc2VudHMgdGltZS5cbiAgICovXG5cbiAgZ2V0WDogKGk6IG51bWJlciwgdDogbnVtYmVyKSA9PiBudW1iZXI7XG4gIGdldFk6IChpOiBudW1iZXIsIHQ6bnVtYmVyKSA9PiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgeFBhcmFtczogUGVuZHVsdW1QYXJhbXNbXSwgXG4gICAgeVBhcmFtczogUGVuZHVsdW1QYXJhbXNbXSwgXG4gICAgLy8gcm90YXRpbmc6IFBlbmR1bHVtUGFyYW1zP1xuICApIHtcbiAgICBjb25zdCB4UGVuZHVsdW1zID0geFBhcmFtcy5tYXAocGFyYW0gPT4gbmV3IFBlbmR1bHVtKHBhcmFtKSk7XG4gICAgY29uc3QgeVBlbmR1bHVtcyA9IHlQYXJhbXMubWFwKHBhcmFtID0+IG5ldyBQZW5kdWx1bShwYXJhbSwgTWF0aC5jb3MpKTtcblxuICAgIHRoaXMuZ2V0WCA9IGZ1bmN0aW9uKGksIHQpIHtcbiAgICAgIGNvbnN0IHZhbHVlcyA9IHhQZW5kdWx1bXMubWFwKHBlbmQgPT4gcGVuZC5nZXRWYWx1ZShpLCB0KSk7XG4gICAgICByZXR1cm4gdmFsdWVzLnJlZHVjZSgodmFsLCBzdW0pID0+IHZhbCArIHN1bSk7XG4gICAgfVxuXG4gICAgdGhpcy5nZXRZID0gZnVuY3Rpb24oaSwgdCkge1xuICAgICAgY29uc3QgdmFsdWVzID0geVBlbmR1bHVtcy5tYXAocGVuZCA9PiBwZW5kLmdldFZhbHVlKGksIHQpKTtcbiAgICAgIHJldHVybiB2YWx1ZXMucmVkdWNlKCh2YWwsIHN1bSkgPT4gdmFsICsgc3VtKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSGFybW9ub2dyYXBoOyIsIid1c2Ugc3RyaWN0JztcbmltcG9ydCBIYXJtb25vZ3JhcGggZnJvbSAnLi9IYXJtb25vZ3JhcGgnO1xuaW1wb3J0IHsgZ2VuZXJhdGVQZW5kdWx1bVBhcmFtcywgUGVuZHVsdW1QYXJhbXMgfSBmcm9tICcuL0hhcm1vbm9ncmFwaCc7XG5cbmNsYXNzIEhhcm1vbm9ncmFwaFZpZXcge1xuICAvKipcbiAgICogVXNlZCB0byByZW5kZXIgdGhlIGhhcm1vbm9ncmFwaCBvbiB0aGUgY2FudmFzLiBcbiAgICovXG4gIG51bV9wb2ludHMgPSAxMDAwMFxuICBsaW1pdCA9IDIwO1xuICB0ID0gMTsgIC8vIFRoZSB0aW1lciBmb3IgdGhlIGN1cnJlbnQgc3RhdGUgb2YgYW5pbWF0aW9uXG4gIGhhcm1vbm9ncmFwaDogSGFybW9ub2dyYXBoO1xuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgdGltZXJSZWY/OiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgXG4gICAgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHhQYXJhbXM6IFBlbmR1bHVtUGFyYW1zW10sXG4gICAgeVBhcmFtczogUGVuZHVsdW1QYXJhbXNbXVxuICApIHtcbiAgICB0aGlzLmN0eCA9IGNvbnRleHQ7XG4gICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgdGhpcy5oYXJtb25vZ3JhcGggPSBuZXcgSGFybW9ub2dyYXBoKHhQYXJhbXMsIHlQYXJhbXMpO1xuICB9XG5cbiAgLy8gVE9ETzogZGVib3VuY2VcbiAgcmVzaXplKCkge1xuICAgIHRoaXMuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHRoaXMuYW5pbWF0ZSgpO1xuICB9XG5cbiAgZHJhdyh0Om51bWJlcikge1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5jYW52YXMud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgIGNvbnN0IGN4ID0gd2lkdGgvODtcbiAgICBjb25zdCBjeSA9IGhlaWdodC84O1xuICAgIGNvbnN0IHNpemUgPSBNYXRoLm1pbih3aWR0aCwgaGVpZ2h0KTtcbiAgICBjb25zdCBzY2FsZSA9IDEuNDUqc2l6ZSAvICg4MDAqTWF0aC5hYnMoTWF0aC5zaW4oMC4wMDA4KnQgKyAyKSkgKyA0MDApOyAvLyBUaGUgZnVuY3Rpb24gZGljdGF0ZXMgdGhlIGRpbGF0aW9uXG4gICAgXG4gICAgLy8gRHJhd2luZyB0aGUgcG9pbnRzXG4gICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgIGZvcihsZXQgaT0wOyBpPHRoaXMubnVtX3BvaW50czsgaSsrKSB7XG4gICAgICBjb25zdCB4ID0gY3ggKyBzY2FsZSAqIHRoaXMuaGFybW9ub2dyYXBoLmdldFgoaSwgdCk7XG4gICAgICBjb25zdCB5ID0gY3kgKyBzY2FsZSAqIHRoaXMuaGFybW9ub2dyYXBoLmdldFkoaSwgdCk7XG4gICAgICBpZihpIDw9IDEpIHRoaXMuY3R4Lm1vdmVUbyhjeCwgY3kpXG4gICAgICBlbHNlIHRoaXMuY3R4LmxpbmVUbyh4LCB5KTtcbiAgICB9XG5cbiAgICAvLyBDb2xvcmluZ1xuICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5jdHguY3JlYXRlUmFkaWFsR3JhZGllbnQoY3gsIGN5LCB0aGlzLmxpbWl0LCBjeCwgY3ksIHNpemUvMik7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICcjODMzYWI0Jyk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNDUsICcjZmQxZDFkJyk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICcjZmNiMDQ1Jyk7XG4gICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBncmFkaWVudDtcbiAgICB0aGlzLmN0eC5nbG9iYWxBbHBoYSA9IDAuM1xuICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xuICB9XG5cbiAgYW5pbWF0ZSgpIHtcbiAgICBpZih0aGlzLnRpbWVyUmVmICE9IG51bGwpIHRoaXMuc3RvcEFuaW1hdGluZygpO1xuXG4gICAgdGhpcy50ICs9IDE7XG4gICAgLy8gUmVzZXQgaWYgd2UgZ2V0IHRvbyBsYXJnZVxuICAgIGlmKHRoaXMudCA+IHRoaXMubnVtX3BvaW50cykgdGhpcy5zdG9wQW5pbWF0aW5nKCk7XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmRyYXcodGhpcy50KTtcbiAgICAgIHRoaXMudGltZXJSZWYgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB0aGlzLmFuaW1hdGUoKSwgMSk7XG4gICAgfVxuICB9XG5cbiAgc3RvcEFuaW1hdGluZygpIHtcbiAgICBpZih0aGlzLnRpbWVyUmVmICE9IG51bGwpIHtcbiAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50aW1lclJlZik7XG4gICAgICB0aGlzLnRpbWVyUmVmID09IG51bGw7XG4gICAgfVxuICB9XG5cbiAgc2F2ZSgpIHtcbiAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGxpbmsuZG93bmxvYWQgPSAnYmFja2dyb3VuZC5wbmcnO1xuICAgIGxpbmsuaHJlZiA9IHRoaXMuY2FudmFzLnRvRGF0YVVSTCgpXG4gICAgbGluay5jbGljaygpO1xuICAgIGxpbmsucmVtb3ZlKCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0SGFybW9ub2dyYXBoKCk6dm9pZCB7XG4gIC8vIEZldGNoIENhbnZhcyBlbGVtZW50XG4gIGNvbnN0IGNhbnZhcyA9IDxIVE1MQ2FudmFzRWxlbWVudD4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tncm91bmQnKTtcblxuICBpZihjYW52YXMuZ2V0Q29udGV4dCA9PSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIEdldCB0aGUgY29udGV4dCBvZiB0aGUgY2FudmFzXG4gIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICBpZihjdHggPT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEluaXRpYWxpemUgdmFyaWFibGVzXG4gIGNvbnN0IHhQYXJhbXMgPSBbZ2VuZXJhdGVQZW5kdWx1bVBhcmFtcygtMywwLjAxMDEsMzIwLDAuMDAwMSksIGdlbmVyYXRlUGVuZHVsdW1QYXJhbXMoMiwwLjA3MzEsMTUwLDAuMDAwMSksIGdlbmVyYXRlUGVuZHVsdW1QYXJhbXMoNC4wMSwwLjAwMTM0LDIwMCwwKV07XG4gIGNvbnN0IHlQYXJhbXMgPSBbZ2VuZXJhdGVQZW5kdWx1bVBhcmFtcygtMywwLjAxMDEsMTAwLDAuMDAwMSksIGdlbmVyYXRlUGVuZHVsdW1QYXJhbXMoMi4wMSwwLjA3MzEsMTAwLDAuMDAwMSksIGdlbmVyYXRlUGVuZHVsdW1QYXJhbXMoNCwwLjAwMTM0LDIwMCwwKV07XG4gIGNvbnN0IGhhcm0gPSBuZXcgSGFybW9ub2dyYXBoVmlldyhjYW52YXMsIGN0eCwgeFBhcmFtcywgeVBhcmFtcyk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IGhhcm0ucmVzaXplKCksIGZhbHNlKTtcbiAgaGFybS5yZXNpemUoKTtcblxuICAvLyBFYXN0ZXIgRWdnIVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAod2luZG93IGFzIGFueSkuZ2V0SGFybW9ub2dyYXBoVmlldyA9ICgpID0+IGhhcm07XG59XG4iLCIndXNlIHN0cmljdCc7XG5pbXBvcnQgeyBzdGFydEhhcm1vbm9ncmFwaCB9IGZyb20gJy4vYmFja2dyb3VuZCc7XG5pbXBvcnQgJy4vc3R5bGVzLmNzcyc7XG4vLyBpbXBvcnQgVGV4dFRyYW5zaXRpb24gZnJvbSAnLi9UZXh0VHJhbnNpdGlvbic7XG5cbi8qKlxuICogQWRkcyBkeW5hbWljIGluZm9ybWF0aW9uIHRvIHRoZSB3ZWxjb21lIGJsdXJiLlxuICovXG5mdW5jdGlvbiBpbml0aWFsaXplV2VsY29tZUJsdXJiKCkge1xuICBjb25zdCBncmVldGluZ3MgPSBbJ01hYnVoYXknLCAn44KI44GG44GT44GdJywgJ0JvbmpvdXInLCAnV2VsY29tZSddO1xuICBjb25zdCBhZ2UgPSAobmV3IERhdGUoKSkuZ2V0RnVsbFllYXIoKSAtIDE5OTg7XG4gIGNvbnN0IGxvY2F0aW9uID0gJ1BoaWxpcHBpbmVzJztcblxuICBjb25zdCBhZ2VFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXJyLWFnZScpO1xuICBjb25zdCBsb2NFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXJyLWxvYycpO1xuICBjb25zdCB3ZWxjb21lRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2VsY29tZS1tc2cnKTtcblxuICBpZiAoYWdlRWwgIT0gbnVsbCApIGFnZUVsLnRleHRDb250ZW50ID0gYWdlLnRvU3RyaW5nKCk7XG4gIGlmIChsb2NFbCAhPSBudWxsICkgbG9jRWwudGV4dENvbnRlbnQgPSBsb2NhdGlvbjtcbiAgaWYgKHdlbGNvbWVFbCAhPSBudWxsICkge1xuICAgIGNvbnN0IGluZCA9IE1hdGgucm91bmQoKGdyZWV0aW5ncy5sZW5ndGggLSAxKSAqIE1hdGgucmFuZG9tKCkpO1xuICAgIGNvbnN0IGdyZWV0aW5nID0gZ3JlZXRpbmdzW2luZF07XG4gICAgaWYgKGdyZWV0aW5nICE9IG51bGwpIHdlbGNvbWVFbC50ZXh0Q29udGVudCA9IGdyZWV0aW5nO1xuICB9ICBcbn1cblxuZnVuY3Rpb24gbWFpbigpIHtcbiAgaW5pdGlhbGl6ZVdlbGNvbWVCbHVyYigpO1xuICBzdGFydEhhcm1vbm9ncmFwaCgpO1xufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIG1haW4sIHtvbmNlOiB0cnVlfSk7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZVxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL21haW4udHNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdleHBvcnRzJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG4iXSwic291cmNlUm9vdCI6IiJ9