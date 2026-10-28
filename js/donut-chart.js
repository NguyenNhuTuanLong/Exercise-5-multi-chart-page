const widthDonut = 1000;
const heightDonut = 500;
const radius = Math.min(widthDonut, heightDonut) / 2 - 20; 

const svgDonut = d3.select("#donut-chart")
                   .append("svg")
                   .attr("viewBox", `0 0 ${widthDonut} ${heightDonut}`);

const innerChartDonut = svgDonut.append("g")
                                .attr("transform", `translate(${widthDonut / 2}, ${heightDonut / 2})`);

d3.csv("data/tvSizeCount.csv", d => {
    return {
        Screensize_Category: d.Screensize_Category, 
        Count: +d["Count*(screensize_inch)"] 
    };
}).then(data => {
    drawDonutChart(data);
});

const drawDonutChart = data => {
    const color = d3.scaleOrdinal()
                    .domain(data.map(d => d.Screensize_Category))
                    .range(d3.schemeSet2); 

    const pie = d3.pie()
                  .value(d => d.Count)
                  .sort(null);

    const arcGenerator = d3.arc()
                           .innerRadius(radius * 0.6)
                           .outerRadius(radius);

    innerChartDonut.selectAll("path")
                   .data(pie(data))
                   .join("path")
                   .attr("d", arcGenerator)
                   .attr("fill", d => color(d.data.Screensize_Category))
                   .attr("stroke", "white")
                   .attr("stroke-width", 2);

    innerChartDonut.selectAll("text")
                   .data(pie(data))
                   .join("text")
                   .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
                   .text(d => d.data.Screensize_Category)
                   .attr("text-anchor", "middle")
                   .style("font-size", "14px")
                   .style("fill", "black");
};