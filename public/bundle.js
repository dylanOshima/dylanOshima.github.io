/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

(function () {
    // Initialize dynamic information
    var age = (new Date()).getFullYear() - 1998;
    console.log('age: ', age);
    var location = 'Philippines';
    var ageEl = document.getElementById('curr-age');
    var locEl = document.getElementById('curr-loc');
    if (ageEl != null)
        ageEl.textContent = age.toString();
    if (locEl != null)
        locEl.textContent = location;
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wZXJzb25hbF9zaXRlLy4vc3JjL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsQ0FBQztJQUNDLGlDQUFpQztJQUNqQyxJQUFNLEdBQUcsR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDMUIsSUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDO0lBRS9CLElBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbEQsSUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUVsRCxJQUFJLEtBQUssSUFBSSxJQUFJO1FBQUcsS0FBSyxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDdkQsSUFBSSxLQUFLLElBQUksSUFBSTtRQUFHLEtBQUssQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDO0FBQ25ELENBQUMsQ0FBQyxFQUFFIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuKGZ1bmN0aW9uKCkge1xuICAvLyBJbml0aWFsaXplIGR5bmFtaWMgaW5mb3JtYXRpb25cbiAgY29uc3QgYWdlID0gKG5ldyBEYXRlKCkpLmdldEZ1bGxZZWFyKCkgLSAxOTk4O1xuICBjb25zb2xlLmxvZygnYWdlOiAnLCBhZ2UpO1xuICBjb25zdCBsb2NhdGlvbiA9ICdQaGlsaXBwaW5lcyc7XG5cbiAgY29uc3QgYWdlRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3Vyci1hZ2UnKTtcbiAgY29uc3QgbG9jRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3Vyci1sb2MnKTtcbiAgXG4gIGlmIChhZ2VFbCAhPSBudWxsICkgYWdlRWwudGV4dENvbnRlbnQgPSBhZ2UudG9TdHJpbmcoKTtcbiAgaWYgKGxvY0VsICE9IG51bGwgKSBsb2NFbC50ZXh0Q29udGVudCA9IGxvY2F0aW9uO1xufSkoKVxuIl0sInNvdXJjZVJvb3QiOiIifQ==