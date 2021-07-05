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
/*!************************!*\
  !*** ./src/js/blog.ts ***!
  \************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
var background_1 = __webpack_require__(/*! ./components/harmonograph/background */ "./src/js/components/harmonograph/background.ts");
function main() {
    background_1.startHarmonograph();
}
window.addEventListener('DOMContentLoaded', main, { once: true });

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wZXJzb25hbF9zaXRlLy4vc3JjL2pzL2NvbXBvbmVudHMvaGFybW9ub2dyYXBoL0hhcm1vbm9ncmFwaC50cyIsIndlYnBhY2s6Ly9wZXJzb25hbF9zaXRlLy4vc3JjL2pzL2NvbXBvbmVudHMvaGFybW9ub2dyYXBoL2JhY2tncm91bmQudHMiLCJ3ZWJwYWNrOi8vcGVyc29uYWxfc2l0ZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wZXJzb25hbF9zaXRlLy4vc3JjL2pzL2Jsb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhOzs7QUFTYixTQUFnQixzQkFBc0IsQ0FBQyxTQUFnQixFQUFFLEtBQVksRUFBRSxTQUFnQixFQUFFLFFBQWU7SUFDdEcsT0FBTztRQUNMLFNBQVM7UUFDVCxLQUFLO1FBQ0wsU0FBUztRQUNULFFBQVE7S0FDVDtBQUNILENBQUM7QUFQRCx3REFPQztBQUVEO0lBT0Usa0JBQVksT0FBdUIsRUFBRSxJQUFlO1FBQWYsOEJBQU8sSUFBSSxDQUFDLEdBQUc7UUFDMUMsYUFBUyxHQUFpQyxPQUFPLFVBQXhDLEVBQUUsS0FBSyxHQUEwQixPQUFPLE1BQWpDLEVBQUUsU0FBUyxHQUFlLE9BQU8sVUFBdEIsRUFBRSxRQUFRLEdBQUssT0FBTyxTQUFaLENBQWE7UUFDMUQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDO0lBQzFCLENBQUM7SUFFRCxzQkFBSSxrQ0FBWTthQUFoQixVQUFpQixDQUFTO1lBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLENB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QUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNoQyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNsQyxJQUFNLEVBQUUsR0FBRyxLQUFLLEdBQUMsQ0FBQyxDQUFDO1FBQ25CLElBQU0sRUFBRSxHQUFHLE1BQU0sR0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDckMsSUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMscUNBQXFDO1FBRTdHLHFCQUFxQjtRQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3JCLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25DLElBQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3BELElBQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3BELElBQUcsQ0FBQyxJQUFJLENBQUM7Z0JBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQzs7Z0JBQzdCLElB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QUcsQ0FBQyxxQ0FBc0IsQ0FBQyxDQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsR0FBRyxFQUFDLE1BQU0sQ0FBQyxFQUFFLHFDQUFzQixDQUFDLElBQUksRUFBQyxNQUFNLEVBQUMsR0FBRyxFQUFDLE1BQU0sQ0FBQyxFQUFFLHFDQUFzQixDQUFDLENBQUMsRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEosSUFBTSxJQUFJLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUVqRSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLGNBQU0sV0FBSSxDQUFDLE1BQU0sRUFBRSxFQUFiLENBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM5RCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFFZCxjQUFjO0lBQ2QsOERBQThEO0lBQzdELE1BQWMsQ0FBQyxtQkFBbUIsR0FBRyxjQUFNLFdBQUksRUFBSixDQUFJLENBQUM7QUFDbkQsQ0FBQztBQXhCRCw4Q0F3QkM7Ozs7Ozs7VUNsSEQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7OztBQ3RCYTs7QUFDYixxSUFBeUU7QUFFekUsU0FBUyxJQUFJO0lBQ1gsOEJBQWlCLEVBQUUsQ0FBQztBQUN0QixDQUFDO0FBRUQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImJsb2cuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCB0eXBlIFBlbmR1bHVtUGFyYW1zID0ge1xuICBmcmVxdWVuY3k6IG51bWJlcixcbiAgcGhhc2U6IG51bWJlcixcbiAgYW1wbGl0dWRlOiBudW1iZXIsXG4gIGhhbGZsaWZlOiBudW1iZXJcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlUGVuZHVsdW1QYXJhbXMoZnJlcXVlbmN5Om51bWJlciwgcGhhc2U6bnVtYmVyLCBhbXBsaXR1ZGU6bnVtYmVyLCBoYWxmbGlmZTpudW1iZXIpOiBQZW5kdWx1bVBhcmFtcyB7XG4gIHJldHVybiB7XG4gICAgZnJlcXVlbmN5LFxuICAgIHBoYXNlLFxuICAgIGFtcGxpdHVkZSxcbiAgICBoYWxmbGlmZSBcbiAgfSBcbn1cblxuY2xhc3MgUGVuZHVsdW0ge1xuICBmdW5jOiAoeDogbnVtYmVyKSA9PiBudW1iZXI7XG4gIGZyZXF1ZW5jeTogbnVtYmVyO1xuICBwaGFzZTogbnVtYmVyO1xuICBhbXBsaXR1ZGU6IG51bWJlcjtcbiAgZGFtcGluZzogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IFBlbmR1bHVtUGFyYW1zLCBmdW5jID0gTWF0aC5zaW4pIHtcbiAgICBjb25zdCB7IGZyZXF1ZW5jeSwgcGhhc2UsIGFtcGxpdHVkZSwgaGFsZmxpZmUgfSA9IG9wdGlvbnM7XG4gICAgdGhpcy5mdW5jID0gZnVuYztcbiAgICB0aGlzLmZyZXF1ZW5jeSA9IHRoaXMudG9SYWRpYW5zKGZyZXF1ZW5jeSk7XG4gICAgdGhpcy5waGFzZSA9IHBoYXNlO1xuICAgIHRoaXMuYW1wbGl0dWRlID0gYW1wbGl0dWRlO1xuICAgIHRoaXMuZGFtcGluZyA9IGhhbGZsaWZlO1xuICB9XG5cbiAgc2V0IHNldEZyZXF1ZW5jeShmOiBudW1iZXIpIHtcbiAgICB0aGlzLmZyZXF1ZW5jeSA9IGY7XG4gIH1cblxuICB0b1JhZGlhbnModjogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHYgKiBNYXRoLlBJIC8gMTgwO1xuICB9XG5cbiAgZ2V0VmFsdWUoaTpudW1iZXIsIHQ6bnVtYmVyKTogbnVtYmVyIHtcbiAgICBjb25zdCBwaGFzZSA9IHRoaXMudG9SYWRpYW5zKHQgKiB0aGlzLnBoYXNlKTtcbiAgICByZXR1cm4gdGhpcy5hbXBsaXR1ZGUgKiBNYXRoLnNpbihpICogdGhpcy5mcmVxdWVuY3kgKyBwaGFzZSkqTWF0aC5leHAoLSh0aGlzLmRhbXBpbmcqaSkpO1xuICB9XG59XG5cbmNsYXNzIEhhcm1vbm9ncmFwaCB7XG4gIC8qKlxuICAgKiBBIGhhcm1vbm9ncmFwaCBjcmVhdGVzIGl0cyBmaWd1cmVzIHVzaW5nIHRoZSBtb3ZlbWVudHMgb2YgZGFtcGVkIHBlbmR1bHVtcy4gVGhlIG1vdmVtZW50IG9mIGEgZGFtcGVkIHBlbmR1bHVtIGlzIGRlc2NyaWJlZCBieSB0aGUgZXF1YXRpb25cbiAgICogeCh0KT1BKnNpbih0ZitwKWVeey1kdH1cbiAgICogaW4gd2hpY2g6XG4gICAqICAgZiByZXByZXNlbnRzIGZyZXF1ZW5jeSxcbiAgICogICBwIHJlcHJlc2VudHMgcGhhc2UsXG4gICAqICAgQSByZXByZXNlbnRzIGFtcGxpdHVkZSxcbiAgICogICBkIHJlcHJlc2VudHMgZGFtcGluZ1xuICAgKiAgIHQgcmVwcmVzZW50cyB0aW1lLlxuICAgKi9cblxuICBnZXRYOiAoaTogbnVtYmVyLCB0OiBudW1iZXIpID0+IG51bWJlcjtcbiAgZ2V0WTogKGk6IG51bWJlciwgdDpudW1iZXIpID0+IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICB4UGFyYW1zOiBQZW5kdWx1bVBhcmFtc1tdLCBcbiAgICB5UGFyYW1zOiBQZW5kdWx1bVBhcmFtc1tdLCBcbiAgICAvLyByb3RhdGluZzogUGVuZHVsdW1QYXJhbXM/XG4gICkge1xuICAgIGNvbnN0IHhQZW5kdWx1bXMgPSB4UGFyYW1zLm1hcChwYXJhbSA9PiBuZXcgUGVuZHVsdW0ocGFyYW0pKTtcbiAgICBjb25zdCB5UGVuZHVsdW1zID0geVBhcmFtcy5tYXAocGFyYW0gPT4gbmV3IFBlbmR1bHVtKHBhcmFtLCBNYXRoLmNvcykpO1xuXG4gICAgdGhpcy5nZXRYID0gZnVuY3Rpb24oaSwgdCkge1xuICAgICAgY29uc3QgdmFsdWVzID0geFBlbmR1bHVtcy5tYXAocGVuZCA9PiBwZW5kLmdldFZhbHVlKGksIHQpKTtcbiAgICAgIHJldHVybiB2YWx1ZXMucmVkdWNlKCh2YWwsIHN1bSkgPT4gdmFsICsgc3VtKTtcbiAgICB9XG5cbiAgICB0aGlzLmdldFkgPSBmdW5jdGlvbihpLCB0KSB7XG4gICAgICBjb25zdCB2YWx1ZXMgPSB5UGVuZHVsdW1zLm1hcChwZW5kID0+IHBlbmQuZ2V0VmFsdWUoaSwgdCkpO1xuICAgICAgcmV0dXJuIHZhbHVlcy5yZWR1Y2UoKHZhbCwgc3VtKSA9PiB2YWwgKyBzdW0pO1xuICAgIH1cbiAgfVxufVxuXG5cblxuZXhwb3J0IGRlZmF1bHQgSGFybW9ub2dyYXBoOyIsIid1c2Ugc3RyaWN0JztcbmltcG9ydCBIYXJtb25vZ3JhcGggZnJvbSAnLi9IYXJtb25vZ3JhcGgnO1xuaW1wb3J0IHsgZ2VuZXJhdGVQZW5kdWx1bVBhcmFtcywgUGVuZHVsdW1QYXJhbXMgfSBmcm9tICcuL0hhcm1vbm9ncmFwaCc7XG5cbmNsYXNzIEhhcm1vbm9ncmFwaFZpZXcge1xuICAvKipcbiAgICogVXNlZCB0byByZW5kZXIgdGhlIGhhcm1vbm9ncmFwaCBvbiB0aGUgY2FudmFzLiBcbiAgICovXG4gIG51bV9wb2ludHMgPSAxMDAwMFxuICBsaW1pdCA9IDIwO1xuICB0ID0gMTsgIC8vIFRoZSB0aW1lciBmb3IgdGhlIGN1cnJlbnQgc3RhdGUgb2YgYW5pbWF0aW9uXG4gIGhhcm1vbm9ncmFwaDogSGFybW9ub2dyYXBoO1xuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgdGltZXJSZWY/OiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgXG4gICAgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgIHhQYXJhbXM6IFBlbmR1bHVtUGFyYW1zW10sXG4gICAgeVBhcmFtczogUGVuZHVsdW1QYXJhbXNbXVxuICApIHtcbiAgICB0aGlzLmN0eCA9IGNvbnRleHQ7XG4gICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgdGhpcy5oYXJtb25vZ3JhcGggPSBuZXcgSGFybW9ub2dyYXBoKHhQYXJhbXMsIHlQYXJhbXMpO1xuICB9XG5cbiAgLy8gVE9ETzogZGVib3VuY2VcbiAgcmVzaXplKCkge1xuICAgIHRoaXMuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHRoaXMuYW5pbWF0ZSgpO1xuICB9XG5cbiAgZHJhdyh0Om51bWJlcikge1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5jYW52YXMud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xuICAgIGNvbnN0IGN4ID0gd2lkdGgvODtcbiAgICBjb25zdCBjeSA9IGhlaWdodC84O1xuICAgIGNvbnN0IHNpemUgPSBNYXRoLm1pbih3aWR0aCwgaGVpZ2h0KTtcbiAgICBjb25zdCBzY2FsZSA9IDEuNDUqc2l6ZSAvICg4MDAqTWF0aC5hYnMoTWF0aC5zaW4oMC4wMDA4KnQgKyAyKSkgKyA0MDApOyAvLyBUaGUgZnVuY3Rpb24gZGljdGF0ZXMgdGhlIGRpbGF0aW9uXG4gICAgXG4gICAgLy8gRHJhd2luZyB0aGUgcG9pbnRzXG4gICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgIGZvcihsZXQgaT0wOyBpPHRoaXMubnVtX3BvaW50czsgaSsrKSB7XG4gICAgICBjb25zdCB4ID0gY3ggKyBzY2FsZSAqIHRoaXMuaGFybW9ub2dyYXBoLmdldFgoaSwgdCk7XG4gICAgICBjb25zdCB5ID0gY3kgKyBzY2FsZSAqIHRoaXMuaGFybW9ub2dyYXBoLmdldFkoaSwgdCk7XG4gICAgICBpZihpIDw9IDEpIHRoaXMuY3R4Lm1vdmVUbyhjeCwgY3kpXG4gICAgICBlbHNlIHRoaXMuY3R4LmxpbmVUbyh4LCB5KTtcbiAgICB9XG5cbiAgICAvLyBDb2xvcmluZ1xuICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5jdHguY3JlYXRlUmFkaWFsR3JhZGllbnQoY3gsIGN5LCB0aGlzLmxpbWl0LCBjeCwgY3ksIHNpemUvMik7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICcjODMzYWI0Jyk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNDUsICcjZmQxZDFkJyk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICcjZmNiMDQ1Jyk7XG4gICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBncmFkaWVudDtcbiAgICB0aGlzLmN0eC5nbG9iYWxBbHBoYSA9IDAuM1xuICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xuICB9XG5cbiAgYW5pbWF0ZSgpIHtcbiAgICBpZih0aGlzLnRpbWVyUmVmICE9IG51bGwpIHRoaXMuc3RvcEFuaW1hdGluZygpO1xuXG4gICAgdGhpcy50ICs9IDE7XG4gICAgLy8gUmVzZXQgaWYgd2UgZ2V0IHRvbyBsYXJnZVxuICAgIGlmKHRoaXMudCA+IHRoaXMubnVtX3BvaW50cykgdGhpcy5zdG9wQW5pbWF0aW5nKCk7XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmRyYXcodGhpcy50KTtcbiAgICAgIHRoaXMudGltZXJSZWYgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB0aGlzLmFuaW1hdGUoKSwgMSk7XG4gICAgfVxuICB9XG5cbiAgc3RvcEFuaW1hdGluZygpIHtcbiAgICBpZih0aGlzLnRpbWVyUmVmICE9IG51bGwpIHtcbiAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50aW1lclJlZik7XG4gICAgICB0aGlzLnRpbWVyUmVmID09IG51bGw7XG4gICAgfVxuICB9XG5cbiAgc2F2ZSgpIHtcbiAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGxpbmsuZG93bmxvYWQgPSAnYmFja2dyb3VuZC5wbmcnO1xuICAgIGxpbmsuaHJlZiA9IHRoaXMuY2FudmFzLnRvRGF0YVVSTCgpXG4gICAgbGluay5jbGljaygpO1xuICAgIGxpbmsucmVtb3ZlKCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0SGFybW9ub2dyYXBoKCk6dm9pZCB7XG4gIC8vIEZldGNoIENhbnZhcyBlbGVtZW50XG4gIGNvbnN0IGNhbnZhcyA9IDxIVE1MQ2FudmFzRWxlbWVudD4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tncm91bmQnKTtcblxuICBpZihjYW52YXMuZ2V0Q29udGV4dCA9PSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIEdldCB0aGUgY29udGV4dCBvZiB0aGUgY2FudmFzXG4gIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICBpZihjdHggPT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEluaXRpYWxpemUgdmFyaWFibGVzXG4gIGNvbnN0IHhQYXJhbXMgPSBbZ2VuZXJhdGVQZW5kdWx1bVBhcmFtcygtMywwLjAxMDEsMzIwLDAuMDAwMSksIGdlbmVyYXRlUGVuZHVsdW1QYXJhbXMoMiwwLjA3MzEsMTUwLDAuMDAwMSksIGdlbmVyYXRlUGVuZHVsdW1QYXJhbXMoNC4wMSwwLjAwMTM0LDIwMCwwKV07XG4gIGNvbnN0IHlQYXJhbXMgPSBbZ2VuZXJhdGVQZW5kdWx1bVBhcmFtcygtMywwLjAxMDEsMTAwLDAuMDAwMSksIGdlbmVyYXRlUGVuZHVsdW1QYXJhbXMoMi4wMSwwLjA3MzEsMTAwLDAuMDAwMSksIGdlbmVyYXRlUGVuZHVsdW1QYXJhbXMoNCwwLjAwMTM0LDIwMCwwKV07XG4gIGNvbnN0IGhhcm0gPSBuZXcgSGFybW9ub2dyYXBoVmlldyhjYW52YXMsIGN0eCwgeFBhcmFtcywgeVBhcmFtcyk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IGhhcm0ucmVzaXplKCksIGZhbHNlKTtcbiAgaGFybS5yZXNpemUoKTtcblxuICAvLyBFYXN0ZXIgRWdnIVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAod2luZG93IGFzIGFueSkuZ2V0SGFybW9ub2dyYXBoVmlldyA9ICgpID0+IGhhcm07XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiJ3VzZSBzdHJpY3QnO1xuaW1wb3J0IHsgc3RhcnRIYXJtb25vZ3JhcGggfSBmcm9tICcuL2NvbXBvbmVudHMvaGFybW9ub2dyYXBoL2JhY2tncm91bmQnO1xuXG5mdW5jdGlvbiBtYWluKCkge1xuICBzdGFydEhhcm1vbm9ncmFwaCgpO1xufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIG1haW4sIHtvbmNlOiB0cnVlfSk7Il0sInNvdXJjZVJvb3QiOiIifQ==