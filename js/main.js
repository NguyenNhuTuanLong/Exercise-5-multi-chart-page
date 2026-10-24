const margin = { top: 40, right: 170, bottom: 25, left: 40 }; 
const width = 1000;
const height = 500;

const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Xóa dòng .style("border", "1px solid black") để biểu đồ giống mẫu
const svg = d3.select("#bar-chart")
              .append("svg")
              .attr("viewBox", `0 0 ${width} ${height}`);

const innerChart = svg.append("g")
                      .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("data/tvEnergyMean.csv", d => {
    // Làm sạch tên nhãn: Đổi "LCD (LED)" thành "LED" và viết hoa toàn bộ
    let techName = d.Screen_Tech.toUpperCase();
    if (techName === "LCD (LED)") {
        techName = "LED";
    }

    return {
        Screen_Tech: techName,
        Energy_Consumption: +d["Mean(Labelled energy consumption (kWh/year))"] 
    };
}).then(data => {
    // Sắp xếp dữ liệu từ cao xuống thấp
    data.sort((a, b) => b.Energy_Consumption - a.Energy_Consumption);
    drawBarChart(data);
});

const drawBarChart = data => {

    const xScale = d3.scaleBand()
                     .domain(data.map(d => d.Screen_Tech))
                     .range([0, innerWidth])
                     .padding(0.1);

    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(data, d => d.Energy_Consumption)])
                     .range([innerHeight, 0]); 

    const bottomAxis = d3.axisBottom(xScale);
    const leftAxis = d3.axisLeft(yScale);

    innerChart.append("g")
              .attr("transform", `translate(0, ${innerHeight})`)
              .call(bottomAxis);

    innerChart.append("g")
              .call(leftAxis);

    // Đẩy chữ lên cao hơn (y: -20) để không bị lẹm vào biểu đồ
    innerChart.append("text")
              .text("Energy Consumption (kWh)")
              .attr("x", -margin.left)
              .attr("y", -20)
              .attr("text-anchor", "start")
              .style("font-size", "12px");

    innerChart.selectAll(".bar")
              .data(data)
              .join("rect")
              .attr("class", "bar")
              .attr("width", xScale.bandwidth())
              .attr("y", d => yScale(d.Energy_Consumption))
              .attr("height", d => innerHeight - yScale(d.Energy_Consumption))
              .attr("x", d => xScale(d.Screen_Tech))
              .attr("fill", "green");

    // THÊM TÙY CHỈNH: Gắn nhãn thông số lên đỉnh các cột
    innerChart.selectAll(".label")
              .data(data)
              .join("text")
              .attr("class", "label")
              // Làm tròn số và thêm chữ kWh
              .text(d => Math.round(d.Energy_Consumption) + " kWh")
              // Căn giữa nhãn theo chiều rộng của cột
              .attr("x", d => xScale(d.Screen_Tech) + xScale.bandwidth() / 2)
              // Đẩy lên cao hơn đỉnh cột 5px
              .attr("y", d => yScale(d.Energy_Consumption) - 5)
              .attr("text-anchor", "middle")
              .style("font-size", "11px");
};