"use strict";

/* Helpers */
function getCounterValue() {
  const counterEl = document.getElementById("counter");
  const value = parseInt(counterEl.textContent, 10);
  return Number.isNaN(value) ? 0 : value;
}

function setCounterValue(newValue) {
  document.getElementById("counter").textContent = String(newValue);
}

function setText(id, text) {
  document.getElementById(id).textContent = text;
}

/* 1pt: Simple Functions */
function tickUp() {
  const current = getCounterValue();
  setCounterValue(current + 1);
}

function tickDown() {
  const current = getCounterValue();
  setCounterValue(current - 1);
}

/* 1pt: Simple For Loop */
function runForLoop() {
  const n = getCounterValue();
  const output = [];

  for (let i = 0; i <= n; i++) {
    output.push(i);
  }

  setText("forLoopResult", output.join(" "));
}

/* 1pt: Repetition with Condition */
function showOddNumbers() {
  const n = getCounterValue();
  const output = [];

  for (let i = 1; i <= n; i += 2) {
    output.push(i);
  }

  setText("oddNumberResult", output.join(" "));
}

/* 1pt: Arrays */
function addMultiplesToArray() {
    let counter = Number(document.getElementById("counter").textContent);

    let multiples = [];

    for (let i = Math.floor(counter / 5) * 5; i >= 5; i -= 5) {
        multiples.push(i);
    }

    console.log(multiples);
}

/* 2pts: Objects and Form Fields */
function printCarObject() {
  const cType = document.getElementById("carType").value;
  const cMPG = document.getElementById("carMPG").value;
  const cColor = document.getElementById("carColor").value;

  const car = { cType, cMPG, cColor };
  console.log(car);
}

/* 2pts: Objects and Form Fields pt. 2 */
function loadCar(which) {
  let selected;

  if (which === 1) selected = carObject1;
  else if (which === 2) selected = carObject2;
  else if (which === 3) selected = carObject3;
  else return;

  document.getElementById("carType").value = selected.cType;
  document.getElementById("carMPG").value = selected.cMPG;
  document.getElementById("carColor").value = selected.cColor;
}

/* 2pt: Changing Styles */
function changeColor(which) {
  const p = document.getElementById("styleParagraph");

  if (which === 1) p.style.color = "red";
  else if (which === 2) p.style.color = "green";
  else if (which === 3) p.style.color = "blue";
}

/* Make functions available to inline onclick="" */
window.tickUp = tickUp;
window.tickDown = tickDown;
window.runForLoop = runForLoop;
window.showOddNumbers = showOddNumbers;
window.addMultiplesToArray = addMultiplesToArray;
window.printCarObject = printCarObject;
window.loadCar = loadCar;
window.changeColor = changeColor;
