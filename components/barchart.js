class Barchart {
    margin = {
        top: 50, right: 10, bottom: 40, left: 40
    }

    constructor(svg, width = 550, height = 550) {
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
        this.zScale = d3.scaleOrdinal().domain(["tcp", "icmp", "udp"]).range(d3.schemeCategory10);

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    }
    update(data, xVar) {
        var new_data = []
        if (xVar === 'normal') {
            new_data = data.filter(d => d["attack"] === 'normal');
        }
        else {
            new_data = data.filter(d => d["attack"] != 'normal');
        }
        console.log(new_data);
        const categories = [...new Set(new_data.map(d => d["protocol_type"]))]
        console.log(categories);
        const counts = {}

        categories.forEach(c => {
            counts[c] = new_data.filter(d => d["protocol_type"] === c).length;
        })
        console.log(counts);
        this.xScale.domain(categories).range([0, this.width]).padding(0.3);
        this.yScale.domain([0, d3.max(Object.values(counts))]).range([this.height, 0]);

        this.container.selectAll("rect")
            .data(categories)
            .join("rect")
            .attr("x", d => this.xScale(d))
            .attr("y", d => this.yScale(counts[d]))
            .attr("width", this.xScale.bandwidth())
            .attr("height", d => this.height - this.yScale(counts[d]))
            // .attr("fill", "lightgray")
            .attr("fill", d => this.zScale(d))

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