function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Stacked-to-grouped bars</h1><a href="https://d3js.org/">D3</a> › <a href="/@d3/gallery">Gallery</a></div>

# Stacked-to-grouped bars

Central government budget allocations for 2019 (source: <code>tw2019ap.csv</code>) are shown by function (x-axis). Each color corresponds to a supervising agency; switch between stacked and grouped layouts to compare totals.`
)}

function _layout(Inputs)
{
  const form = Inputs.radio(
    new Map(["stacked", "grouped"].map((t) => [`${t[0].toUpperCase()}${t.slice(1)}`, t])),
    {value: "stacked"}
  );
  const interval = setInterval(() => {
    form.value = form.value === "grouped" ? "stacked" : "grouped";
    form.dispatchEvent(new CustomEvent("input"));
  }, 2000);
  form.oninput = (event) => event.isTrusted && clearInterval(interval);
  return form;
}


function _chart(d3,n,yz,xz)
{

  const width = 928;
  const height = 500;
  const marginTop = 0;
  const marginRight = 0;
  const marginBottom = 200;
  const marginLeft = 0;

  const y01z = d3
    .stack()
    .keys(d3.range(n))(d3.transpose(yz)) // stacked yz
    .map((data, i) => data.map(([y0, y1]) => [y0, y1, i]));

  const yMax = d3.max(yz, y => d3.max(y));
  const y1Max = d3.max(y01z, y => d3.max(y, d => d[1]));

  const x = d3
    .scaleBand()
    .domain(xz)
    .rangeRound([marginLeft, width - marginRight])
    .padding(0.08);

  const y = d3
    .scaleLinear()
    .domain([0, y1Max])
    .range([height - marginBottom, marginTop]);

  const color = d3.scaleSequential(d3.interpolateBlues)
      .domain([-0.5 * n, 1.5 * n]);

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto;");

  const rect = svg.selectAll("g")
    .data(y01z)
    .join("g")
      .attr("fill", (d, i) => color(i))
    .selectAll("rect")
    .data(d => d)
    .join("rect")
      .attr("x", (d, i) => x(xz[i]))
      .attr("y", height - marginBottom)
      .attr("width", x.bandwidth())
      .attr("height", 0);

  const xAxis = svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  xAxis
    .selectAll("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-35)")
    .attr("dx", "-0.6em")
    .attr("dy", "0.4em");

  function transitionGrouped() {
    y.domain([0, yMax]);

    rect.transition()
        .duration(500)
        .delay((d, i) => i * 20)
        .attr("x", (d, i) => x(xz[i]) + (x.bandwidth() / n) * d[2])
        .attr("width", x.bandwidth() / n)
      .transition()
        .attr("y", d => y(d[1] - d[0]))
        .attr("height", d => y(0) - y(d[1] - d[0]));
  }

  function transitionStacked() {
    y.domain([0, y1Max]);

    rect.transition()
        .duration(500)
        .delay((d, i) => i * 20)
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
      .transition()
        .attr("x", (d, i) => x(xz[i]))
        .attr("width", x.bandwidth());
  }

  function update(layout) {
    if (layout === "stacked") transitionStacked();
    else transitionGrouped();
  }

  return Object.assign(svg.node(), {update});
}


function _update(chart,layout){return(
chart.update(layout)
)}

function _xz(categories){return(
categories
)}

function _yz(d3,topnames,categories,budgetData){return(
(() => {
  const totals = d3.rollup(
    budgetData,
    v => d3.sum(v, d => d.amount),
    d => d.topname,
    d => d.cat
  );

  return topnames.map(topname =>
    categories.map(category => totals.get(topname)?.get(category) ?? 0)
  );
})()
)}

function _topnames(d3,budgetData){return(
d3
  .rollups(budgetData, v => d3.sum(v, d => d.amount), d => d.topname)
  .sort((a, b) => d3.descending(a[1], b[1]))
  .map(([name]) => name)
)}

function _categories(d3,budgetData){return(
d3
  .rollups(budgetData, v => d3.sum(v, d => d.amount), d => d.cat)
  .sort((a, b) => d3.descending(a[1], b[1]))
  .map(([category]) => category)
)}

function _budgetData(d3){return(
d3.csv("tw2019ap.csv", d3.autoType)
)}

function _n(topnames){return(
topnames.length
)}

function _m(categories){return(
categories.length
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof layout")).define("viewof layout", ["Inputs"], _layout);
  main.variable(observer("layout")).define("layout", ["Generators", "viewof layout"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["d3","n","yz","xz"], _chart);
  main.variable(observer("update")).define("update", ["chart","layout"], _update);
  main.variable(observer("xz")).define("xz", ["categories"], _xz);
  main.variable(observer("yz")).define("yz", ["d3","topnames","categories","budgetData"], _yz);
  main.variable(observer("topnames")).define("topnames", ["d3","budgetData"], _topnames);
  main.variable(observer("categories")).define("categories", ["d3","budgetData"], _categories);
  main.variable(observer("budgetData")).define("budgetData", ["d3"], _budgetData);
  main.variable(observer("n")).define("n", ["topnames"], _n);
  main.variable(observer("m")).define("m", ["categories"], _m);
  return main;
}
