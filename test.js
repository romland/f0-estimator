import F0Estimator from "./F0-estimator.js";

let f0estimator = new F0Estimator(0.8, 0.5);
let streamData = [];

for(let i = 0; i < 1_000_000; i++) { streamData.push(`a${i}`); }
for(let i = 1_000_000; i >= 0; i--) { streamData.push(`a${i}`); }

let currentStreamLength = streamData.length;

f0estimator.updateThresh(currentStreamLength);
console.log("Threshold:", f0estimator.thresh);

console.time("cost");
for(let item of streamData) {
    const success = f0estimator.processStreamItem(item);
    if(!success) break;
}
console.timeEnd("cost");

let estimatedF0 = f0estimator.getEstimate();
console.log("Result:", estimatedF0);
