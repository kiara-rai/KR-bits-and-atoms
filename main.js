import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

console.log("Displaying simple bar chart");

// Declare the chart dimensions and margins.
const width = 1250;
const height = 600;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

async function fetchData() {
  const url = "./data.json";
  let response = await fetch(url);

  if (response.ok) {
    // if HTTP-status is 200-299
    // get the response body (the method explained below)
    let json = await response.json();
    console.log("Finally received the response:");
    console.log("Response: ", json);
    drawChart(json);
  } else {
    alert("HTTP-Error: " + response.status);
  }
}

function drawChart(data) {
  console.log("data: ", data);

  // Create the SVG container.
  const svg = d3.create("svg").attr("width", width).attr("height", height);

  const maxEmission = d3.max(data, (d) => d.emission);
  const maxLand = d3.max(data, (l) => l.land);
  const maxWater = d3.max(data, (w) => w.water);
  const maxEutro = d3.max(data, (e) => e.eutro);
  const productNames = data.map(item => item.Product)
  console.log("productNames", productNames)

  // Declare the x (horizontal position) scale.
  const x = d3.scaleBand()
    .domain(productNames)
    .range([marginLeft, width - marginRight])
    .padding(0.2);

  // Declare the y (vertical position) scale.
  const y = d3
    .scaleLinear()
    .domain([0, maxEutro])
    .range([height - marginBottom, marginTop]);

  // Add the x-axis.
  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x));

  // Add the y-axis.
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft}, 0)`)
    .call(d3.axisLeft(y));

  // Declare the bars
  svg
    .append("g")
    .selectAll()
    .data(data)
    .join("rect")
      .attr("fill", "grey")
      .attr("x", (d) => {
        return x(d.Product)
      })
      .attr("y", (d) => y(d.emission))
      .attr("height", (d) => height - y(d.emission) - marginBottom)
      .attr("data-product", (d) => d.Product)
      .attr("width", x.bandwidth() / 4)
  svg
      .append("g")
      .selectAll()
      .data(data)
      .join("rect")
        .attr("fill", "#597D55")
        .attr("x", (d) => {
          return x(d.Product) + x.bandwidth() / 4
        })
        .attr("y", (d) => y(d.land))
        .attr("height", (d) => height - y(d.land) - marginBottom)
        .attr("data-product", (d) => d.Product)
        .attr("width", x.bandwidth() / 4)
  svg
      .append("g")
      .selectAll()
      .data(data)
      .join("rect")
        .attr("fill", "#576981")
        .attr("x", (d) => {
          return x(d.Product) + x.bandwidth() / 4 + x.bandwidth() / 4 
        })
        .attr("y", (d) => y(d.water))
        .attr("height", (d) => height - y(d.water) - marginBottom)
        .attr("data-product", (d) => d.Product)
        .attr("width", x.bandwidth() / 4)
  svg
      .append("g")
      .selectAll()
      .data(data)
      .join("rect")
        .attr("fill", "#7E6356")
        .attr("x", (d) => {
          return x(d.Product) + x.bandwidth() / 4 + x.bandwidth() / 4 + x.bandwidth() / 4 
        })
        .attr("y", (d) => y(d.eutro))
        .attr("height", (d) => height - y(d.eutro) - marginBottom)
        .attr("data-product", (d) => d.Product)
        .attr("width", x.bandwidth() / 4)

   
  // Add y-axis label
  svg
    .append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("font-size", "10px")
    .attr("font-family", "sans-serif")
    .attr("x", 200)
    .attr("y", 0)
    .attr("dy", ".75em")
    .text("Greenhouse gas emissions (kgCO₂e/liter), ");

  // Append the SVG element.
  const container = document.getElementById("container");
  container.append(svg.node());
}

fetchData();
