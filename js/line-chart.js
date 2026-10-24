// ==========================================================
// 1. THIẾT LẬP KÍCH THƯỚC VÀ MARGIN (LỀ)
// ==========================================================
const marginLine = { top: 40, right: 170, bottom: 25, left: 40 }; 
const widthLine = 1000;
const heightLine = 500;

const innerWidthLine = widthLine - marginLine.left - marginLine.right;
const innerHeightLine = heightLine - marginLine.top - marginLine.bottom;

// Chọn div "line-chart" để gắn SVG
const svgLine = d3.select("#line-chart")
                  .append("svg")
                  .attr("viewBox", `0 0 ${widthLine} ${heightLine}`);

// Tạo khung vẽ bên trong (innerChart)
const innerChartLine = svgLine.append("g")
                              .attr("transform", `translate(${marginLine.left}, ${marginLine.top})`);


// ==========================================================
// 2. ĐỌC DỮ LIỆU TỪ CSV VỚI TÊN CỘT CHUẨN XÁC
// ==========================================================
d3.csv("data/ARE_Spot_Prices.csv", d => {
    return {
        year: +d.Year, 
        averagePrice: +d["Average Price (notTas-Snowy)"] 
    };
}).then(data => {
    console.log("Line Chart Data:", data); 
    drawLineChart(data);
});


// ==========================================================
// 3. HÀM VẼ BIỂU ĐỒ ĐƯỜNG VÀ PHÂN TÁN
// ==========================================================
const drawLineChart = data => {

    // --- A. TẠO HÀM TỶ LỆ (SCALES) ---
    const xScale = d3.scaleLinear()
                     .domain(d3.extent(data, d => d.year))
                     .range([0, innerWidthLine]);

    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(data, d => d.averagePrice)])
                     .range([innerHeightLine, 0]);


    // --- B. THÊM TRỤC TOẠ ĐỘ (AXES) ---
    const bottomAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")); 
    const leftAxis = d3.axisLeft(yScale);

    // Gắn trục X xuống đáy
    innerChartLine.append("g")
                  .attr("transform", `translate(0, ${innerHeightLine})`)
                  .call(bottomAxis);

    // Gắn trục Y bên trái
    innerChartLine.append("g")
                  .call(leftAxis);


    // --- C. VẼ BIỂU ĐỒ PHÂN TÁN (SCATTER PLOT) ---
    innerChartLine.selectAll("circle")
                  .data(data)
                  .join("circle")
                  .attr("r", 4) // Bán kính dấu chấm là 4px
                  .attr("cx", d => xScale(d.year)) // Tọa độ X là năm
                  .attr("cy", d => yScale(d.averagePrice)) // Tọa độ Y là giá
                  .attr("fill", "green"); // SỬA TẠI ĐÂY: Đổi từ "black" sang "green" để khớp hình mẫu


    // --- D. VẼ BIỂU ĐỒ ĐƯỜNG (LINE) ---
    const lineGenerator = d3.line()
                            .x(d => xScale(d.year))
                            .y(d => yScale(d.averagePrice));

    innerChartLine.append("path")
                  .attr("d", lineGenerator(data))
                  .attr("fill", "none") // Biểu đồ đường không được tô kín màu nền
                  .attr("stroke", "green") // Đường nối có màu xanh lá
                  .attr("stroke-width", 1.5); // Chỉnh độ dày của đường
};