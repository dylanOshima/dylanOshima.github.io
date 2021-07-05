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
/*!*************************************************************!*\
  !*** ./src/js/components/harmonograph/harmonographIndex.ts ***!
  \*************************************************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
// Adds the harmonograph component to a site.
var background_1 = __webpack_require__(/*! ./background */ "./src/js/components/harmonograph/background.ts");
window.addEventListener('DOMContentLoaded', background_1.startHarmonograph, { once: true });

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wZXJzb25hbF9zaXRlLy4vc3JjL2pzL2NvbXBvbmVudHMvaGFybW9ub2dyYXBoL0hhcm1vbm9ncmFwaC50cyIsIndlYnBhY2s6Ly9wZXJzb25hbF9zaXRlLy4vc3JjL2pzL2NvbXBvbmVudHMvaGFybW9ub2dyYXBoL2JhY2tncm91bmQudHMiLCJ3ZWJwYWNrOi8vcGVyc29uYWxfc2l0ZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wZXJzb25hbF9zaXRlLy4vc3JjL2pzL2NvbXBvbmVudHMvaGFybW9ub2dyYXBoL2hhcm1vbm9ncmFwaEluZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTs7O0FBU2IsU0FBZ0Isc0JBQXNCLENBQUMsU0FBZ0IsRUFBRSxLQUFZLEVBQUUsU0FBZ0IsRUFBRSxRQUFlO0lBQ3RHLE9BQU87UUFDTCxTQUFTO1FBQ1QsS0FBSztRQUNMLFNBQVM7UUFDVCxRQUFRO0tBQ1Q7QUFDSCxDQUFDO0FBUEQsd0RBT0M7QUFFRDtJQU9FLGtCQUFZLE9BQXVCLEVBQUUsSUFBZTtRQUFmLDhCQUFPLElBQUksQ0FBQyxHQUFHO1FBQzFDLGFBQVMsR0FBaUMsT0FBTyxVQUF4QyxFQUFFLEtBQUssR0FBMEIsT0FBTyxNQUFqQyxFQUFFLFNBQVMsR0FBZSxPQUFPLFVBQXRCLEVBQUUsUUFBUSxHQUFLLE9BQU8sU0FBWixDQUFhO1FBQzFELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztJQUMxQixDQUFDO0lBRUQsc0JBQUksa0NBQVk7YUFBaEIsVUFBaUIsQ0FBUztZQUN4QixJ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QUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hKLElBQU0sT0FBTyxHQUFHLENBQUMscUNBQXNCLENBQUMsQ0FBQyxDQUFDLEVBQUMsTUFBTSxFQUFDLEdBQUcsRUFBQyxNQUFNLENBQUMsRUFBRSxxQ0FBc0IsQ0FBQyxJQUFJLEVBQUMsTUFBTSxFQUFDLEdBQUcsRUFBQyxNQUFNLENBQUMsRUFBRSxxQ0FBc0IsQ0FBQyxDQUFDLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hKLElBQU0sSUFBSSxHQUFHLElBQUksZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFakUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxjQUFNLFdBQUksQ0FBQyxNQUFNLEVBQUUsRUFBYixDQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDOUQsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBRWQsY0FBYztJQUNkLDhEQUE4RDtJQUM3RCxNQUFjLENBQUMsbUJBQW1CLEdBQUcsY0FBTSxXQUFJLEVBQUosQ0FBSSxDQUFDO0FBQ25ELENBQUM7QUF4QkQsOENBd0JDOzs7Ozs7O1VDbEhEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7OztBQ3RCQSw2Q0FBNkM7QUFDN0MsNkdBQWlEO0FBQ2pELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSw4QkFBaUIsRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6Imhhcm1vbm9ncmFwaEluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgdHlwZSBQZW5kdWx1bVBhcmFtcyA9IHtcbiAgZnJlcXVlbmN5OiBudW1iZXIsXG4gIHBoYXNlOiBudW1iZXIsXG4gIGFtcGxpdHVkZTogbnVtYmVyLFxuICBoYWxmbGlmZTogbnVtYmVyXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVBlbmR1bHVtUGFyYW1zKGZyZXF1ZW5jeTpudW1iZXIsIHBoYXNlOm51bWJlciwgYW1wbGl0dWRlOm51bWJlciwgaGFsZmxpZmU6bnVtYmVyKTogUGVuZHVsdW1QYXJhbXMge1xuICByZXR1cm4ge1xuICAgIGZyZXF1ZW5jeSxcbiAgICBwaGFzZSxcbiAgICBhbXBsaXR1ZGUsXG4gICAgaGFsZmxpZmUgXG4gIH0gXG59XG5cbmNsYXNzIFBlbmR1bHVtIHtcbiAgZnVuYzogKHg6IG51bWJlcikgPT4gbnVtYmVyO1xuICBmcmVxdWVuY3k6IG51bWJlcjtcbiAgcGhhc2U6IG51bWJlcjtcbiAgYW1wbGl0dWRlOiBudW1iZXI7XG4gIGRhbXBpbmc6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBQZW5kdWx1bVBhcmFtcywgZnVuYyA9IE1hdGguc2luKSB7XG4gICAgY29uc3QgeyBmcmVxdWVuY3ksIHBoYXNlLCBhbXBsaXR1ZGUsIGhhbGZsaWZlIH0gPSBvcHRpb25zO1xuICAgIHRoaXMuZnVuYyA9IGZ1bmM7XG4gICAgdGhpcy5mcmVxdWVuY3kgPSB0aGlzLnRvUmFkaWFucyhmcmVxdWVuY3kpO1xuICAgIHRoaXMucGhhc2UgPSBwaGFzZTtcbiAgICB0aGlzLmFtcGxpdHVkZSA9IGFtcGxpdHVkZTtcbiAgICB0aGlzLmRhbXBpbmcgPSBoYWxmbGlmZTtcbiAgfVxuXG4gIHNldCBzZXRGcmVxdWVuY3koZjogbnVtYmVyKSB7XG4gICAgdGhpcy5mcmVxdWVuY3kgPSBmO1xuICB9XG5cbiAgdG9SYWRpYW5zKHY6IG51bWJlcikge1xuICAgIHJldHVybiB2ICogTWF0aC5QSSAvIDE4MDtcbiAgfVxuXG4gIGdldFZhbHVlKGk6bnVtYmVyLCB0Om51bWJlcik6IG51bWJlciB7XG4gICAgY29uc3QgcGhhc2UgPSB0aGlzLnRvUmFkaWFucyh0ICogdGhpcy5waGFzZSk7XG4gICAgcmV0dXJuIHRoaXMuYW1wbGl0dWRlICogTWF0aC5zaW4oaSAqIHRoaXMuZnJlcXVlbmN5ICsgcGhhc2UpKk1hdGguZXhwKC0odGhpcy5kYW1waW5nKmkpKTtcbiAgfVxufVxuXG5jbGFzcyBIYXJtb25vZ3JhcGgge1xuICAvKipcbiAgICogQSBoYXJtb25vZ3JhcGggY3JlYXRlcyBpdHMgZmlndXJlcyB1c2luZyB0aGUgbW92ZW1lbnRzIG9mIGRhbXBlZCBwZW5kdWx1bXMuIFRoZSBtb3ZlbWVudCBvZiBhIGRhbXBlZCBwZW5kdWx1bSBpcyBkZXNjcmliZWQgYnkgdGhlIGVxdWF0aW9uXG4gICAqIHgodCk9QSpzaW4odGYrcCllXnstZHR9XG4gICAqIGluIHdoaWNoOlxuICAgKiAgIGYgcmVwcmVzZW50cyBmcmVxdWVuY3ksXG4gICAqICAgcCByZXByZXNlbnRzIHBoYXNlLFxuICAgKiAgIEEgcmVwcmVzZW50cyBhbXBsaXR1ZGUsXG4gICAqICAgZCByZXByZXNlbnRzIGRhbXBpbmdcbiAgICogICB0IHJlcHJlc2VudHMgdGltZS5cbiAgICovXG5cbiAgZ2V0WDogKGk6IG51bWJlciwgdDogbnVtYmVyKSA9PiBudW1iZXI7XG4gIGdldFk6IChpOiBudW1iZXIsIHQ6bnVtYmVyKSA9PiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgeFBhcmFtczogUGVuZHVsdW1QYXJhbXNbXSwgXG4gICAgeVBhcmFtczogUGVuZHVsdW1QYXJhbXNbXSwgXG4gICAgLy8gcm90YXRpbmc6IFBlbmR1bHVtUGFyYW1zP1xuICApIHtcbiAgICBjb25zdCB4UGVuZHVsdW1zID0geFBhcmFtcy5tYXAocGFyYW0gPT4gbmV3IFBlbmR1bHVtKHBhcmFtKSk7XG4gICAgY29uc3QgeVBlbmR1bHVtcyA9IHlQYXJhbXMubWFwKHBhcmFtID0+IG5ldyBQZW5kdWx1bShwYXJhbSwgTWF0aC5jb3MpKTtcblxuICAgIHRoaXMuZ2V0WCA9IGZ1bmN0aW9uKGksIHQpIHtcbiAgICAgIGNvbnN0IHZhbHVlcyA9IHhQZW5kdWx1bXMubWFwKHBlbmQgPT4gcGVuZC5nZXRWYWx1ZShpLCB0KSk7XG4gICAgICByZXR1cm4gdmFsdWVzLnJlZHVjZSgodmFsLCBzdW0pID0+IHZhbCArIHN1bSk7XG4gICAgfVxuXG4gICAgdGhpcy5nZXRZID0gZnVuY3Rpb24oaSwgdCkge1xuICAgICAgY29uc3QgdmFsdWVzID0geVBlbmR1bHVtcy5tYXAocGVuZCA9PiBwZW5kLmdldFZhbHVlKGksIHQpKTtcbiAgICAgIHJldHVybiB2YWx1ZXMucmVkdWNlKCh2YWwsIHN1bSkgPT4gdmFsICsgc3VtKTtcbiAgICB9XG4gIH1cbn1cblxuXG5cbmV4cG9ydCBkZWZhdWx0IEhhcm1vbm9ncmFwaDsiLCIndXNlIHN0cmljdCc7XG5pbXBvcnQgSGFybW9ub2dyYXBoIGZyb20gJy4vSGFybW9ub2dyYXBoJztcbmltcG9ydCB7IGdlbmVyYXRlUGVuZHVsdW1QYXJhbXMsIFBlbmR1bHVtUGFyYW1zIH0gZnJvbSAnLi9IYXJtb25vZ3JhcGgnO1xuXG5jbGFzcyBIYXJtb25vZ3JhcGhWaWV3IHtcbiAgLyoqXG4gICAqIFVzZWQgdG8gcmVuZGVyIHRoZSBoYXJtb25vZ3JhcGggb24gdGhlIGNhbnZhcy4gXG4gICAqL1xuICBudW1fcG9pbnRzID0gMTAwMDBcbiAgbGltaXQgPSAyMDtcbiAgdCA9IDE7ICAvLyBUaGUgdGltZXIgZm9yIHRoZSBjdXJyZW50IHN0YXRlIG9mIGFuaW1hdGlvblxuICBoYXJtb25vZ3JhcGg6IEhhcm1vbm9ncmFwaDtcbiAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIHRpbWVyUmVmPzogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIFxuICAgIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcbiAgICB4UGFyYW1zOiBQZW5kdWx1bVBhcmFtc1tdLFxuICAgIHlQYXJhbXM6IFBlbmR1bHVtUGFyYW1zW11cbiAgKSB7XG4gICAgdGhpcy5jdHggPSBjb250ZXh0O1xuICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgIHRoaXMuaGFybW9ub2dyYXBoID0gbmV3IEhhcm1vbm9ncmFwaCh4UGFyYW1zLCB5UGFyYW1zKTtcbiAgfVxuXG4gIC8vIFRPRE86IGRlYm91bmNlXG4gIHJlc2l6ZSgpIHtcbiAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICB0aGlzLmFuaW1hdGUoKTtcbiAgfVxuXG4gIGRyYXcodDpudW1iZXIpIHtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMuY2FudmFzLndpZHRoO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodDtcbiAgICBjb25zdCBjeCA9IHdpZHRoLzg7XG4gICAgY29uc3QgY3kgPSBoZWlnaHQvODtcbiAgICBjb25zdCBzaXplID0gTWF0aC5taW4od2lkdGgsIGhlaWdodCk7XG4gICAgY29uc3Qgc2NhbGUgPSAxLjQ1KnNpemUgLyAoODAwKk1hdGguYWJzKE1hdGguc2luKDAuMDAwOCp0ICsgMikpICsgNDAwKTsgLy8gVGhlIGZ1bmN0aW9uIGRpY3RhdGVzIHRoZSBkaWxhdGlvblxuICAgIFxuICAgIC8vIERyYXdpbmcgdGhlIHBvaW50c1xuICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICBmb3IobGV0IGk9MDsgaTx0aGlzLm51bV9wb2ludHM7IGkrKykge1xuICAgICAgY29uc3QgeCA9IGN4ICsgc2NhbGUgKiB0aGlzLmhhcm1vbm9ncmFwaC5nZXRYKGksIHQpO1xuICAgICAgY29uc3QgeSA9IGN5ICsgc2NhbGUgKiB0aGlzLmhhcm1vbm9ncmFwaC5nZXRZKGksIHQpO1xuICAgICAgaWYoaSA8PSAxKSB0aGlzLmN0eC5tb3ZlVG8oY3gsIGN5KVxuICAgICAgZWxzZSB0aGlzLmN0eC5saW5lVG8oeCwgeSk7XG4gICAgfVxuXG4gICAgLy8gQ29sb3JpbmdcbiAgICBjb25zdCBncmFkaWVudCA9IHRoaXMuY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KGN4LCBjeSwgdGhpcy5saW1pdCwgY3gsIGN5LCBzaXplLzIpO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCAnIzgzM2FiNCcpO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjQ1LCAnI2ZkMWQxZCcpO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAnI2ZjYjA0NScpO1xuICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gZ3JhZGllbnQ7XG4gICAgdGhpcy5jdHguZ2xvYmFsQWxwaGEgPSAwLjNcbiAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgfVxuXG4gIGFuaW1hdGUoKSB7XG4gICAgaWYodGhpcy50aW1lclJlZiAhPSBudWxsKSB0aGlzLnN0b3BBbmltYXRpbmcoKTtcblxuICAgIHRoaXMudCArPSAxO1xuICAgIC8vIFJlc2V0IGlmIHdlIGdldCB0b28gbGFyZ2VcbiAgICBpZih0aGlzLnQgPiB0aGlzLm51bV9wb2ludHMpIHRoaXMuc3RvcEFuaW1hdGluZygpO1xuICAgIGVsc2Uge1xuICAgICAgdGhpcy5kcmF3KHRoaXMudCk7XG4gICAgICB0aGlzLnRpbWVyUmVmID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4gdGhpcy5hbmltYXRlKCksIDEpO1xuICAgIH1cbiAgfVxuXG4gIHN0b3BBbmltYXRpbmcoKSB7XG4gICAgaWYodGhpcy50aW1lclJlZiAhPSBudWxsKSB7XG4gICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudGltZXJSZWYpO1xuICAgICAgdGhpcy50aW1lclJlZiA9PSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHNhdmUoKSB7XG4gICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBsaW5rLmRvd25sb2FkID0gJ2JhY2tncm91bmQucG5nJztcbiAgICBsaW5rLmhyZWYgPSB0aGlzLmNhbnZhcy50b0RhdGFVUkwoKVxuICAgIGxpbmsuY2xpY2soKTtcbiAgICBsaW5rLnJlbW92ZSgpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydEhhcm1vbm9ncmFwaCgpOnZvaWQge1xuICAvLyBGZXRjaCBDYW52YXMgZWxlbWVudFxuICBjb25zdCBjYW52YXMgPSA8SFRNTENhbnZhc0VsZW1lbnQ+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrZ3JvdW5kJyk7XG5cbiAgaWYoY2FudmFzLmdldENvbnRleHQgPT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBHZXQgdGhlIGNvbnRleHQgb2YgdGhlIGNhbnZhc1xuICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgaWYoY3R4ID09IG51bGwpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBJbml0aWFsaXplIHZhcmlhYmxlc1xuICBjb25zdCB4UGFyYW1zID0gW2dlbmVyYXRlUGVuZHVsdW1QYXJhbXMoLTMsMC4wMTAxLDMyMCwwLjAwMDEpLCBnZW5lcmF0ZVBlbmR1bHVtUGFyYW1zKDIsMC4wNzMxLDE1MCwwLjAwMDEpLCBnZW5lcmF0ZVBlbmR1bHVtUGFyYW1zKDQuMDEsMC4wMDEzNCwyMDAsMCldO1xuICBjb25zdCB5UGFyYW1zID0gW2dlbmVyYXRlUGVuZHVsdW1QYXJhbXMoLTMsMC4wMTAxLDEwMCwwLjAwMDEpLCBnZW5lcmF0ZVBlbmR1bHVtUGFyYW1zKDIuMDEsMC4wNzMxLDEwMCwwLjAwMDEpLCBnZW5lcmF0ZVBlbmR1bHVtUGFyYW1zKDQsMC4wMDEzNCwyMDAsMCldO1xuICBjb25zdCBoYXJtID0gbmV3IEhhcm1vbm9ncmFwaFZpZXcoY2FudmFzLCBjdHgsIHhQYXJhbXMsIHlQYXJhbXMpO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiBoYXJtLnJlc2l6ZSgpLCBmYWxzZSk7XG4gIGhhcm0ucmVzaXplKCk7XG5cbiAgLy8gRWFzdGVyIEVnZyFcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgKHdpbmRvdyBhcyBhbnkpLmdldEhhcm1vbm9ncmFwaFZpZXcgPSAoKSA9PiBoYXJtO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIEFkZHMgdGhlIGhhcm1vbm9ncmFwaCBjb21wb25lbnQgdG8gYSBzaXRlLlxuaW1wb3J0IHsgc3RhcnRIYXJtb25vZ3JhcGggfSBmcm9tIFwiLi9iYWNrZ3JvdW5kXCI7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIHN0YXJ0SGFybW9ub2dyYXBoLCB7b25jZTogdHJ1ZX0pOyJdLCJzb3VyY2VSb290IjoiIn0=