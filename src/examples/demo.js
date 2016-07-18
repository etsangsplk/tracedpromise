/* eslint-disable no-console */
import opentracing from 'opentracing/dist/opentracing-node-debug.js';
import lightstep from 'lightstep-tracer';
import TracedPromise from '../..';

// Ensure the Node line numbers are accurate in stack traces
require('source-map-support');

// Initialize the tracing implementation, in this case LightStep is used.
// Replace '{your_access_token}' with your LightStep access token to send the
// tracing data to your project.
opentracing.initGlobalTracer(lightstep.tracer({
    access_token   : '{your_access_token}',
    component_name : 'node/promises',
}));


// Set up an initial span to track all the subsequent work
let parent = opentracing.startSpan('Promises.all');

let p1 = new TracedPromise(parent, 'p1', (resolve, reject) => {
    setTimeout(resolve, 100, 'one');
});
let p2 = new TracedPromise(parent, 'p2', (resolve, reject) => {
    setTimeout(resolve, 200, 'two');
});
let p3 = new TracedPromise(parent, 'p3', (resolve, reject) => {
    setTimeout(resolve, 300, 'three');
});
let p4 = new TracedPromise(parent, 'p4', (resolve, reject) => {
    setTimeout(resolve, 400, 'four');
});
let p5 = new TracedPromise(parent, 'p5', (resolve, reject) => {
    setTimeout(reject, 250, 'failure!');
});

TracedPromise.all(parent, [p1, p2, p3, p4, p5]).then(value => {
    console.log(`Resolved: ${value}`);
}, reason => {
    console.log(`Rejected: ${reason}`);
});
