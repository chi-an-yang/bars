# Stacked-to-grouped bars

https://observablehq.com/d/59bc3f5a63513e0b@281

View this notebook in your browser by running a web server in this folder. For
example:

~~~sh
npx http-server
~~~

Or, use the [Observable Runtime](https://github.com/observablehq/runtime) to
import this module directly into your application. To npm install:

~~~sh
npm install @observablehq/runtime@5
npm install https://api.observablehq.com/d/59bc3f5a63513e0b@281.tgz?v=3
~~~

Then, import your notebook and the runtime as:

~~~js
import {Runtime, Inspector} from "@observablehq/runtime";
import define from "59bc3f5a63513e0b";
~~~

To log the value of the cell named “foo”:

~~~js
const runtime = new Runtime();
const main = runtime.module(define);
main.value("foo").then(value => console.log(value));
~~~

## Deploying to GitHub Pages

This repository is ready to publish as a static site via GitHub Pages. Once you
push to `main` (or this `work` branch), GitHub Actions will package the
repository contents and deploy them to Pages automatically. You can also trigger
the workflow manually from the Actions tab using **Deploy to GitHub Pages**.
