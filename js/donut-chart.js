// ==========================================================
// 1. THIẾT LẬP KÍCH THƯỚC VÀ BÁN KÍNH
// ==========================================================
const widthDonut = 1000;
const heightDonut = 500;
// Bán kính biểu đồ tròn tính bằng một nửa cạnh ngắn nhất trừ đi lề 20px
const radius = Math.min(widthDonut, heightDonut) / 2 - 20; 

// ==========================================================
// 2. KHỞI TẠO KHUNG SVG VÀ TÂM BIỂU ĐỒ
// ==========================================================
const svgDonut = d3.select("#donut-chart")
                   .append("svg")
                   .attr("viewBox", `0 0 ${widthDonut} ${heightDonut}`);

// Với biểu đồ tròn, gốc tọa độ (0,0) phải nằm ở chính giữa khung hình
const innerChartDonut = svgDonut.append("g")
                                .attr("transform", `translate(${widthDonut / 2}, ${heightDonut / 2})`);


// ==========================================================
// 3. ĐỌC DỮ LIỆU TỪ CSV VỚI TÊN CỘT CHUẨN XÁC TỪ KNIME
// ==========================================================
d3.csv("data/tvSizeCount.csv", d => {
    return {
        Screensize_Category: d.Screensize_Category, 
        Count: +d["Count*(screensize_inch)"] 
    };
}).then(data => {
    console.log("Donut Chart Data:", data);
    drawDonutChart(data);
});


// ==========================================================
// 4. HÀM VẼ BIỂU ĐỒ DONUT
// ==========================================================
const drawDonutChart = data => {

    // --- A. THANG MÀU SẮC ---
    // scaleOrdinal gán mỗi danh mục một màu tự động từ bộ schemeSet2 của D3
    const color = d3.scaleOrdinal()
                    .domain(data.map(d => d.Screensize_Category))
                    .range(d3.schemeSet2); 

    // --- B. HÀM TÍNH GÓC (PIE) ---
    // Hàm pie tự động chuyển đổi số lượng (Count) thành các góc (radians)
    const pie = d3.pie()
                  .value(d => d.Count)
                  .sort(null); // Giữ nguyên thứ tự trong file CSV

    // --- C. HÀM TẠO HÌNH CUNG (ARC GENERATOR) ---
    // SỬA TẠI ĐÂY: Xóa padAngle và cornerRadius để bánh liền khối giống hình mẫu
    const arcGenerator = d3.arc()
                           .innerRadius(radius * 0.6) // Bán kính lỗ hổng ở giữa (60%)
                           .outerRadius(radius);      // Bán kính viền ngoài (100%)

    // --- D. VẼ CÁC LÁT CẮT ---
    innerChartDonut.selectAll("path")
                   .data(pie(data)) // Nạp dữ liệu đã quy đổi thành góc
                   .join("path")
                   .attr("d", arcGenerator) // Vẽ viền dựa trên arcGenerator
                   .attr("fill", d => color(d.data.Screensize_Category)) // Tô màu theo kích thước
                   .attr("stroke", "white") // Đường viền trắng mỏng ngăn cách
                   .attr("stroke-width", 2);

    // --- E. GẮN NHÃN (LABELS) ---
    // Đặt chữ mô tả vào chính giữa từng lát cắt
    innerChartDonut.selectAll("text")
                   .data(pie(data))
                   .join("text")
                   // .centroid(d) tự động tìm tọa độ điểm giữa (tâm) của lát cắt đó
                   .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
                   .text(d => d.data.Screensize_Category)
                   .attr("text-anchor", "middle")
                   .style("font-size", "14px")
                   .style("fill", "black");
};