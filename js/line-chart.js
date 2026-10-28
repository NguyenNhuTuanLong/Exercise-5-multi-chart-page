const marginLine = { top: 40, right: 170, bottom: 25, left: 40 }; 
const widthLine = 1000;
const heightLine = 500;

const innerWidthLine = widthLine - marginLine.left - marginLine.right;
const innerHeightLine = heightLine - marginLine.top - marginLine.bottom;

const svgLine = d3.select("#line-chart")
                  .append("svg")
                  .attr("viewBox", `0 0 ${widthLine} ${heightLine}`);

const innerChartLine = svgLine.append("g")
                              .attr("transform", `translate(${marginLine.left}, ${marginLine.top})`);

d3.csv("data/ARE_Spot_Prices.csv", d => {
    return {
        year: +d.Year, 
        averagePrice: +d["Average Price (notTas-Snowy)"] 
    };
}).then(data => {
    drawLineChart(data);
});

const drawLineChart = data => {
    const xScale = d3.scaleLinear()
                     .domain(d3.extent(data, d => d.year))
                     .range([0, innerWidthLine]);

    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(data, d => d.averagePrice)])
                     .range([innerHeightLine, 0]);

    const bottomAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")); 
    const leftAxis = d3.axisLeft(yScale);

    innerChartLine.append("g")
                  .attr("transform", `translate(0, ${innerHeightLine})`)
                  .call(bottomAxis);

    innerChartLine.append("g").call(leftAxis);

    innerChartLine.selectAll("circle")
                  .data(data)
                  .join("circle")
                  .attr("r", 4)
                  .attr("cx", d => xScale(d.year))
                  .attr("cy", d => yScale(d.averagePrice))
                  .attr("fill", "green");

    const lineGenerator = d3.line()
                            .x(d => xScale(d.year))
                            .y(d => yScale(d.averagePrice));

    innerChartLine.append("path")
                  .attr("d", lineGenerator(data))
                  .attr("fill", "none")
                  .attr("stroke", "green")
                  .attr("stroke-width", 1.5);
};