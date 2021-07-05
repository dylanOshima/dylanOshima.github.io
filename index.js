/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/components/harmonograph/Harmonograph.ts":
/*!********************************************************!*\
  !*** ./src/js/components/harmonograph/Harmonograph.ts ***!
  \********************************************************/
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

/***/ "./src/js/components/harmonograph/background.ts":
/*!******************************************************!*\
  !*** ./src/js/components/harmonograph/background.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.startHarmonograph = void 0;
var Harmonograph_1 = __importDefault(__webpack_require__(/*! ./Harmonograph */ "./src/js/components/harmonograph/Harmonograph.ts"));
var Harmonograph_2 = __webpack_require__(/*! ./Harmonograph */ "./src/js/components/harmonograph/Harmonograph.ts");
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


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*************************!*\
  !*** ./src/js/index.ts ***!
  \*************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
var background_1 = __webpack_require__(/*! ./components/harmonograph/background */ "./src/js/components/harmonograph/background.ts");
var LOCATION = 'the United Kingdom';
var GREETINGS = ['Mabuhay', 'ようこそ', 'Bonjour', 'Welcome'];
/**
 * Adds dynamic information to the welcome blurb.
 */
function initializeWelcomeBlurb() {
    // Update age
    var age = (new Date()).getFullYear() - 1998;
    var ageEl = document.getElementById('curr-age');
    if (ageEl != null)
        ageEl.textContent = age.toString();
    // Update location
    var locEl = document.getElementById('curr-loc');
    if (locEl != null)
        locEl.textContent = LOCATION;
    // Update greeting
    var welcomeEl = document.getElementById('welcome-msg');
    if (welcomeEl != null) {
        var ind = Math.round((GREETINGS.length - 1) * Math.random());
        var greeting = GREETINGS[ind];
        if (greeting != null)
            welcomeEl.textContent = greeting;
    }
}
function main() {
    // console.log('home!');
    initializeWelcomeBlurb();
    background_1.startHarmonograph();
}
window.addEventListener('DOMContentLoaded', main, { once: true });

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wZXJzb25hbF9zaXRlLy4vc3JjL2pzL2NvbXBvbmVudHMvaGFybW9ub2dyYXBoL0hhcm1vbm9ncmFwaC50cyIsIndlYnBhY2s6Ly9wZXJzb25hbF9zaXRlLy4vc3JjL2pzL2NvbXBvbmVudHMvaGFybW9ub2dyYXBoL2JhY2tncm91bmQudHMiLCJ3ZWJwYWNrOi8vcGVyc29uYWxfc2l0ZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wZXJzb25hbF9zaXRlLy4vc3JjL2pzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTs7O0FBU2IsU0FBZ0Isc0JBQXNCLENBQUMsU0FBZ0IsRUFBRSxLQUFZLEVBQUUsU0FBZ0IsRUFBRSxRQUFlO0lBQ3RHLE9BQU87UUFDTCxTQUFTO1FBQ1QsS0FBSztRQUNMLFNBQVM7UUFDVCxRQUFRO0tBQ1Q7QUFDSCxDQUFDO0FBUEQsd0RBT0M7QUFFRDtJQU9FLGtCQUFZLE9BQXVCLEVBQUUsSUFBZTtRQUFmLDhCQUFPLElBQUksQ0FBQyxHQUFHO1FBQzFDLGFBQVMsR0FBaUMsT0FBTyxVQUF4QyxFQUFFLEtBQUssR0FBMEIsT0FBTyxNQUFqQyxFQUFFLFNBQVMsR0FBZSxPQUFPLFVBQXRCLEVBQUUsUUFBUSxHQUFLLE9BQU8sU0FBWixDQUFhO1FBQzFELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztJQUMxQixDQUFDO0lBRUQsc0JBQUksa0NBQVk7YUFBaEIsVUFBaUIsQ0FBUztZQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNyQixD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QUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDaEMsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEMsSUFBTSxFQUFFLEdBQUcsS0FBSyxHQUFDLENBQUMsQ0FBQztRQUNuQixJQUFNLEVBQUUsR0FBRyxNQUFNLEdBQUMsQ0FBQyxDQUFDO1FBQ3BCLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3JDLElBQU0sS0FBSyxHQUFHLElBQUksR0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLHFDQUFxQztRQUU3RyxxQkFBcUI7UUFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNyQixLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNuQyxJQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNwRCxJQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNwRCxJQUFHLENBQUMsSUFBSSxDQUFDO2dCQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7O2dCQUM3QixJ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QUFDLENBQUM7SUFDbEQsSUFBSSxLQUFLLElBQUksSUFBSTtRQUFHLEtBQUssQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3ZELGtCQUFrQjtJQUNsQixJQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2xELElBQUksS0FBSyxJQUFJLElBQUk7UUFBRyxLQUFLLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQztJQUNqRCxrQkFBa0I7SUFDbEIsSUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUN6RCxJQUFJLFNBQVMsSUFBSSxJQUFJLEVBQUc7UUFDdEIsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDL0QsSUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLElBQUksUUFBUSxJQUFJLElBQUk7WUFBRSxTQUFTLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQztLQUN4RDtBQUNILENBQUM7QUFFRCxTQUFTLElBQUk7SUFDWCx3QkFBd0I7SUFDeEIsc0JBQXNCLEVBQUUsQ0FBQztJQUN6Qiw4QkFBaUIsRUFBRSxDQUFDO0FBQ3RCLENBQUM7QUFFRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCB0eXBlIFBlbmR1bHVtUGFyYW1zID0ge1xuICBmcmVxdWVuY3k6IG51bWJlcixcbiAgcGhhc2U6IG51bWJlcixcbiAgYW1wbGl0dWRlOiBudW1iZXIsXG4gIGhhbGZsaWZlOiBudW1iZXJcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlUGVuZHVsdW1QYXJhbXMoZnJlcXVlbmN5Om51bWJlciwgcGhhc2U6bnVtYmVyLCBhbXBsaXR1ZGU6bnVtYmVyLCBoYWxmbGlmZTpudW1iZXIpOiBQZW5kdWx1bVBhcmFtcyB7XG4gIHJldHVybiB7XG4gICAgZnJlcXVlbmN5LFxuICAgIHBoYXNlLFxuICAgIGFtcGxpdHVkZSxcbiAgICBoYWxmbGlmZSBcbiAgfSBcbn1cblxuY2xhc3MgUGVuZHVsdW0ge1xuICBmdW5jOiAoeDogbnVtYmVyKSA9PiBudW1iZXI7XG4gIGZyZXF1ZW5jeTogbnVtYmVyO1xuICBwaGFzZTogbnVtYmVyO1xuICBhbXBsaXR1ZGU6IG51bWJlcjtcbiAgZGFtcGluZzogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IFBlbmR1bHVtUGFyYW1zLCBmdW5jID0gTWF0aC5zaW4pIHtcbiAgICBjb25zdCB7IGZyZXF1ZW5jeSwgcGhhc2UsIGFtcGxpdHVkZSwgaGFsZmxpZmUgfSA9IG9wdGlvbnM7XG4gICAgdGhpcy5mdW5jID0gZnVuYztcbiAgICB0aGlzLmZyZXF1ZW5jeSA9IHRoaXMudG9SYWRpYW5zKGZyZXF1ZW5jeSk7XG4gICAgdGhpcy5waGFzZSA9IHBoYXNlO1xuICAgIHRoaXMuYW1wbGl0dWRlID0gYW1wbGl0dWRlO1xuICAgIHRoaXMuZGFtcGluZyA9IGhhbGZsaWZlO1xuICB9XG5cbiAgc2V0IHNldEZyZXF1ZW5jeShmOiBudW1iZXIpIHtcbiAgICB0aGlzLmZyZXF1ZW5jeSA9IGY7XG4gIH1cblxuICB0b1JhZGlhbnModjogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHYgKiBNYXRoLlBJIC8gMTgwO1xuICB9XG5cbiAgZ2V0VmFsdWUoaTpudW1iZXIsIHQ6bnVtYmVyKTogbnVtYmVyIHtcbiAgICBjb25zdCBwaGFzZSA9IHRoaXMudG9SYWRpYW5zKHQgKiB0aGlzLnBoYXNlKTtcbiAgICByZXR1cm4gdGhpcy5hbXBsaXR1ZGUgKiBNYXRoLnNpbihpICogdGhpcy5mcmVxdWVuY3kgKyBwaGFzZSkqTWF0aC5leHAoLSh0aGlzLmRhbXBpbmcqaSkpO1xuICB9XG59XG5cbmNsYXNzIEhhcm1vbm9ncmFwaCB7XG4gIC8qKlxuICAgKiBBIGhhcm1vbm9ncmFwaCBjcmVhdGVzIGl0cyBmaWd1cmVzIHVzaW5nIHRoZSBtb3ZlbWVudHMgb2YgZGFtcGVkIHBlbmR1bHVtcy4gVGhlIG1vdmVtZW50IG9mIGEgZGFtcGVkIHBlbmR1bHVtIGlzIGRlc2NyaWJlZCBieSB0aGUgZXF1YXRpb25cbiAgICogeCh0KT1BKnNpbih0ZitwKWVeey1kdH1cbiAgICogaW4gd2hpY2g6XG4gICAqICAgZiByZXByZXNlbnRzIGZyZXF1ZW5jeSxcbiAgICogICBwIHJlcHJlc2VudHMgcGhhc2UsXG4gICAqICAgQSByZXByZXNlbnRzIGFtcGxpdHVkZSxcbiAgICogICBkIHJlcHJlc2VudHMgZGFtcGluZ1xuICAgKiAgIHQgcmVwcmVzZW50cyB0aW1lLlxuICAgKi9cblxuICBnZXRYOiAoaTogbnVtYmVyLCB0OiBudW1iZXIpID0+IG51bWJlcjtcbiAgZ2V0WTogKGk6IG51bWJlciwgdDpudW1iZXIpID0+IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICB4UGFyYW1zOiBQZW5kdWx1bVBhcmFtc1tdLCBcbiAgICB5UGFyYW1zOiBQZW5kdWx1bVBhcmFtc1tdLCBcbiAgICAvLyByb3RhdGluZzogUGVuZHVsdW1QYXJhbXM/XG4gICkge1xuICAgIGNvbnN0IHhQZW5kdWx1bXMgPSB4UGFyYW1zLm1hcChwYXJhbSA9PiBuZXcgUGVuZHVsdW0ocGFyYW0pKTtcbiAgICBjb25zdCB5UGVuZHVsdW1zID0geVBhcmFtcy5tYXAocGFyYW0gPT4gbmV3IFBlbmR1bHVtKHBhcmFtLCBNYXRoLmNvcykpO1xuXG4gICAgdGhpcy5nZXRYID0gZnVuY3Rpb24oaSwgdCkge1xuICAgICAgY29uc3QgdmFsdWVzID0geFBlbmR1bHVtcy5tYXAocGVuZCA9PiBwZW5kLmdldFZhbHVlKGksIHQpKTtcbiAgICAgIHJldHVybiB2YWx1ZXMucmVkdWNlKCh2YWwsIHN1bSkgPT4gdmFsICsgc3VtKTtcbiAgICB9XG5cbiAgICB0aGlzLmdldFkgPSBmdW5jdGlvbihpLCB0KSB7XG4gICAgICBjb25zdCB2YWx1ZXMgPSB5UGVuZHVsdW1zLm1hcChwZW5kID0+IHBlbmQuZ2V0VmFsdWUoaSwgdCkpO1xuICAgICAgcmV0dXJuIHZhbHVlcy5yZWR1Y2UoKHZhbCwgc3VtKSA9PiB2YWwgKyBzdW0pO1xuICAgIH1cbiAgfVxufVxuXG5cblxuZXhwb3J0IGRlZmF1bHQgSGFybW9ub2dyYXBoOyIsIid1c2Ugc3RyaWN0JztcbmltcG9ydCBIYXJtb25vZ3JhcGggZnJvbSAnLi9IYXJtb25vZ3JhcGgnO1xuaW1wb3J0IHsgZ2VuZXJhdGVQZW5kdWx1bVBhcmFtcywgUGVuZHVsdW1QYXJhbXMgfSBmcm9tICcuL0hhcm1vbm9ncmFwaCc7XG5cbmNsYXNzIEhhcm1vbm9ncmFwaFZpZXcge1xuICAvKipcbiAgICogVXNlZCB0byByZW5kZXIgdGhlIGhhcm1vbm9ncmFwaCBvbiB0aGUgY2FudmFzLiBcbiAgICovXG4gIG51bV9wb2ludHMgPSAxMDAwMFxuICBsaW1pdCA9IDIwO1xuICB0ID0gMTsgIC8vIFRoZSB0aW1lciBmb3IgdGhlIGN1cnJlbnQgc3RhdGUgb2YgYW5pbWF0aW9uXG4gIGhhcm1vbm9ncmFwaDogSGFybW9ub2dyYXBoO1xuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgdGltZXJSZWY/OiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgXG4gICAgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHhQYXJhbXM6IFBlbmR1bHVtUGFyYW1zW10sXG4gICAgeVBhcmFtczogUGVuZHVsdW1QYXJhbXNbXVxuICApIHtcbiAgICB0aGlzLmN0eCA9IGNvbnRleHQ7XG4gICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgdGhpcy5oYXJtb25vZ3JhcGggPSBuZXcgSGFybW9ub2dyYXBoKHhQYXJhbXMsIHlQYXJhbXMpO1xuICB9XG5cbiAgLy8gVE9ETzogZGVib3VuY2VcbiAgcmVzaXplKCkge1xuICAgIHRoaXMuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHRoaXMuYW5pbWF0ZSgpO1xuICB9XG5cbiAgZHJhdyh0Om51bWJlcikge1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5jYW52YXMud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgIGNvbnN0IGN4ID0gd2lkdGgvODtcbiAgICBjb25zdCBjeSA9IGhlaWdodC84O1xuICAgIGNvbnN0IHNpemUgPSBNYXRoLm1pbih3aWR0aCwgaGVpZ2h0KTtcbiAgICBjb25zdCBzY2FsZSA9IDEuNDUqc2l6ZSAvICg4MDAqTWF0aC5hYnMoTWF0aC5zaW4oMC4wMDA4KnQgKyAyKSkgKyA0MDApOyAvLyBUaGUgZnVuY3Rpb24gZGljdGF0ZXMgdGhlIGRpbGF0aW9uXG4gICAgXG4gICAgLy8gRHJhd2luZyB0aGUgcG9pbnRzXG4gICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgIGZvcihsZXQgaT0wOyBpPHRoaXMubnVtX3BvaW50czsgaSsrKSB7XG4gICAgICBjb25zdCB4ID0gY3ggKyBzY2FsZSAqIHRoaXMuaGFybW9ub2dyYXBoLmdldFgoaSwgdCk7XG4gICAgICBjb25zdCB5ID0gY3kgKyBzY2FsZSAqIHRoaXMuaGFybW9ub2dyYXBoLmdldFkoaSwgdCk7XG4gICAgICBpZihpIDw9IDEpIHRoaXMuY3R4Lm1vdmVUbyhjeCwgY3kpXG4gICAgICBlbHNlIHRoaXMuY3R4LmxpbmVUbyh4LCB5KTtcbiAgICB9XG5cbiAgICAvLyBDb2xvcmluZ1xuICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5jdHguY3JlYXRlUmFkaWFsR3JhZGllbnQoY3gsIGN5LCB0aGlzLmxpbWl0LCBjeCwgY3ksIHNpemUvMik7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICcjODMzYWI0Jyk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNDUsICcjZmQxZDFkJyk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICcjZmNiMDQ1Jyk7XG4gICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBncmFkaWVudDtcbiAgICB0aGlzLmN0eC5nbG9iYWxBbHBoYSA9IDAuM1xuICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xuICB9XG5cbiAgYW5pbWF0ZSgpIHtcbiAgICBpZih0aGlzLnRpbWVyUmVmICE9IG51bGwpIHRoaXMuc3RvcEFuaW1hdGluZygpO1xuXG4gICAgdGhpcy50ICs9IDE7XG4gICAgLy8gUmVzZXQgaWYgd2UgZ2V0IHRvbyBsYXJnZVxuICAgIGlmKHRoaXMudCA+IHRoaXMubnVtX3BvaW50cykgdGhpcy5zdG9wQW5pbWF0aW5nKCk7XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmRyYXcodGhpcy50KTtcbiAgICAgIHRoaXMudGltZXJSZWYgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB0aGlzLmFuaW1hdGUoKSwgMSk7XG4gICAgfVxuICB9XG5cbiAgc3RvcEFuaW1hdGluZygpIHtcbiAgICBpZih0aGlzLnRpbWVyUmVmICE9IG51bGwpIHtcbiAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50aW1lclJlZik7XG4gICAgICB0aGlzLnRpbWVyUmVmID09IG51bGw7XG4gICAgfVxuICB9XG5cbiAgc2F2ZSgpIHtcbiAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGxpbmsuZG93bmxvYWQgPSAnYmFja2dyb3VuZC5wbmcnO1xuICAgIGxpbmsuaHJlZiA9IHRoaXMuY2FudmFzLnRvRGF0YVVSTCgpXG4gICAgbGluay5jbGljaygpO1xuICAgIGxpbmsucmVtb3ZlKCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0SGFybW9ub2dyYXBoKCk6dm9pZCB7XG4gIC8vIEZldGNoIENhbnZhcyBlbGVtZW50XG4gIGNvbnN0IGNhbnZhcyA9IDxIVE1MQ2FudmFzRWxlbWVudD4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tncm91bmQnKTtcblxuICBpZihjYW52YXMuZ2V0Q29udGV4dCA9PSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIEdldCB0aGUgY29udGV4dCBvZiB0aGUgY2FudmFzXG4gIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICBpZihjdHggPT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEluaXRpYWxpemUgdmFyaWFibGVzXG4gIGNvbnN0IHhQYXJhbXMgPSBbZ2VuZXJhdGVQZW5kdWx1bVBhcmFtcygtMywwLjAxMDEsMzIwLDAuMDAwMSksIGdlbmVyYXRlUGVuZHVsdW1QYXJhbXMoMiwwLjA3MzEsMTUwLDAuMDAwMSksIGdlbmVyYXRlUGVuZHVsdW1QYXJhbXMoNC4wMSwwLjAwMTM0LDIwMCwwKV07XG4gIGNvbnN0IHlQYXJhbXMgPSBbZ2VuZXJhdGVQZW5kdWx1bVBhcmFtcygtMywwLjAxMDEsMTAwLDAuMDAwMSksIGdlbmVyYXRlUGVuZHVsdW1QYXJhbXMoMi4wMSwwLjA3MzEsMTAwLDAuMDAwMSksIGdlbmVyYXRlUGVuZHVsdW1QYXJhbXMoNCwwLjAwMTM0LDIwMCwwKV07XG4gIGNvbnN0IGhhcm0gPSBuZXcgSGFybW9ub2dyYXBoVmlldyhjYW52YXMsIGN0eCwgeFBhcmFtcywgeVBhcmFtcyk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IGhhcm0ucmVzaXplKCksIGZhbHNlKTtcbiAgaGFybS5yZXNpemUoKTtcblxuICAvLyBFYXN0ZXIgRWdnIVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAod2luZG93IGFzIGFueSkuZ2V0SGFybW9ub2dyYXBoVmlldyA9ICgpID0+IGhhcm07XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiJ3VzZSBzdHJpY3QnO1xuaW1wb3J0IHsgc3RhcnRIYXJtb25vZ3JhcGggfSBmcm9tICcuL2NvbXBvbmVudHMvaGFybW9ub2dyYXBoL2JhY2tncm91bmQnO1xuXG5jb25zdCBMT0NBVElPTiA9ICd0aGUgVW5pdGVkIEtpbmdkb20nO1xuY29uc3QgR1JFRVRJTkdTID0gWydNYWJ1aGF5JywgJ+OCiOOBhuOBk+OBnScsICdCb25qb3VyJywgJ1dlbGNvbWUnXTtcblxuLyoqXG4gKiBBZGRzIGR5bmFtaWMgaW5mb3JtYXRpb24gdG8gdGhlIHdlbGNvbWUgYmx1cmIuXG4gKi9cbmZ1bmN0aW9uIGluaXRpYWxpemVXZWxjb21lQmx1cmIoKSB7XG4gIC8vIFVwZGF0ZSBhZ2VcbiAgY29uc3QgYWdlID0gKG5ldyBEYXRlKCkpLmdldEZ1bGxZZWFyKCkgLSAxOTk4O1xuICBjb25zdCBhZ2VFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXJyLWFnZScpO1xuICBpZiAoYWdlRWwgIT0gbnVsbCApIGFnZUVsLnRleHRDb250ZW50ID0gYWdlLnRvU3RyaW5nKCk7XG4gIC8vIFVwZGF0ZSBsb2NhdGlvblxuICBjb25zdCBsb2NFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXJyLWxvYycpO1xuICBpZiAobG9jRWwgIT0gbnVsbCApIGxvY0VsLnRleHRDb250ZW50ID0gTE9DQVRJT047XG4gIC8vIFVwZGF0ZSBncmVldGluZ1xuICBjb25zdCB3ZWxjb21lRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2VsY29tZS1tc2cnKTtcbiAgaWYgKHdlbGNvbWVFbCAhPSBudWxsICkge1xuICAgIGNvbnN0IGluZCA9IE1hdGgucm91bmQoKEdSRUVUSU5HUy5sZW5ndGggLSAxKSAqIE1hdGgucmFuZG9tKCkpO1xuICAgIGNvbnN0IGdyZWV0aW5nID0gR1JFRVRJTkdTW2luZF07XG4gICAgaWYgKGdyZWV0aW5nICE9IG51bGwpIHdlbGNvbWVFbC50ZXh0Q29udGVudCA9IGdyZWV0aW5nO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1haW4oKSB7XG4gIC8vIGNvbnNvbGUubG9nKCdob21lIScpO1xuICBpbml0aWFsaXplV2VsY29tZUJsdXJiKCk7XG4gIHN0YXJ0SGFybW9ub2dyYXBoKCk7XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgbWFpbiwge29uY2U6IHRydWV9KTsiXSwic291cmNlUm9vdCI6IiJ9