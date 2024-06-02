class Boxplot {
    margin = {
        top: 50, right: 200, bottom: 40, left: 200
    }

    constructor(svg, width = 600, height = 600) {
        this.svg = svg;
        this.width = width;
        this.height = height;
    }
    
    initialize() {
        this.svg = d3.select(this.svg);
        this.container = this.svg.append("g");
        this.xAxis = this.svg.append("g");
        this.yAxis = this.svg.append("g");
        this.legend = this.svg.append("g");

        this.xScale = d3.scaleBand();
        this.yScale = d3.scaleLinear();

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    }
    update(data, xVar) {
        const arrays = data.map(d => d[xVar]);
        console.log(xVar);
        console.log(arrays);
        const counts = {}
        
        this.xScale.range([0, this.width])
            .domain([xVar])


        var data_sorted = arrays.sort(d3.ascending)
        var q1 = d3.quantile(data_sorted, .25)
        var median = d3.quantile(data_sorted, .5)
        console.log(median)
        var q3 = d3.quantile(data_sorted, .75)
        var interQuantileRange = q3 - q1
        var min = q1 - 1.5 * interQuantileRange
        var max = q1 + 1.5 * interQuantileRange
        this.yScale.domain([0, d3.max(arrays)]).range([this.height, 0]);

        console.log(q1);
        console.log(q3);
        this.container.selectAll("line")
            .data([0])
            .join("line")
            .attr("x1", d => this.width / 2)
            .attr("x2", d => this.width / 2)
            .attr("y1", d => min > 0 ? this.yScale(min) : this.yScale(0))
            .attr("y2", d => max < d3.max(arrays) ? this.yScale(max) : this.yScale(d3.max(arrays)))
            .attr("stroke", "black")
            .style("width", 40)
        
        console.log(this.yScale(min))
        var center = this.width / 2
        var boxWidth = 100
        this.container.selectAll("rect")
            .data([0])
            .join("rect")
                .attr("x", d => this.width / 2 - boxWidth / 2)
                .attr("y", d => this.yScale(q3))
                .attr("height", d => this.yScale(q1) - this.yScale(q3))
                .attr("width", boxWidth)
                .attr("stroke", "black")
                .style("fill", "#69b3a2")

        this.container.selectAll("medianLine")
            .data([0])
            .enter()
            .append("line")
            .attr("x1", center - boxWidth / 2)
            .attr("x2", center + boxWidth / 2)
            .attr("y1", this.yScale(median))
            .attr("y2", this.yScale(median))
            .attr("stroke", "black")
            .style("width", 80)
        var jitterWidth = 50

        const new_array = arrays.filter(element => {
            return element < min || element > max
        })
        console.log(new_array)
        this.container.selectAll("circle")
            .data(new_array)
            .join("circle")
            .attr("cx", this.width / 2)
            .attr("cy", a => this.yScale(a))
            .attr("r", 4)
            .style("fill", "white")
            .attr("stroke", "black")
        this.xAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .transition()
            .call(d3.axisBottom(this.xScale));

        this.yAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .transition()
            .call(d3.axisLeft(this.yScale));
    }
}