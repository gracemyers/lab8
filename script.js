
async function scatterplot() {
    const format = d3.format(",");
    let data = await d3.csv(
        'driving.csv',
        d3.autoType
    );
    console.log(data)
    let margin = { top: 40, right: 20, bottom: 40, left: 50 },
    width = document.querySelector(".chart").clientWidth - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;
    width = width > 700 ? 700 : width;
    
    const svg = d3
        .select(".chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    const x = d3
        .scaleLinear()
        .range([0, width])
        .domain(d3.extent(data, d => d.miles))
        .nice()
    
   const y = d3
        .scaleLinear()
        .range([height, 0])
        .domain(d3.extent(data, d => d.gas))
        .nice();

   const xAxis = d3
      .axisBottom()
      .scale(x)
      .ticks(5);

    const yAxis = d3
        .axisLeft()
        .scale(y)
        .tickFormat(d3.format("($.2f"))
    
    let xvalue = svg.append("g")
        .attr("class", "axis x-axis")
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`)
        .call(g => {
            g.append("text")
                .text("Miles per person per year")
                .attr("text-anchor", "end")
                .attr("y", -5)
                .attr("x", width - 10)
                .attr("font-size", 11)
                .attr("font-weight", "bold")
                .attr("fill", "black")
                .call(halo)
        })

        let yvalue = svg.append("g")
            .attr("class", "axis y-axis")
            .call(yAxis)
            .call(g => {
                g.append("text")
                    .text("Cost per gallon")
                    .attr("text-anchor", "start")
                    .attr("y", 5)
                    .attr("x", 10)
                    .attr("font-size", 11)
                    .attr("font-weight", "bold")
                    .attr("fill", "black")
                    .call(halo)
            })
        xvalue.select(".domain").remove()

        yvalue.select(".domain").remove()

            yvalue.selectAll(".tick line")
                .clone()
                .attr("x2", width)
                .attr("stroke-opacity", 0.1)
        
            xvalue.selectAll(".tick line")
                .clone()
                .attr("y2", -height)
                .attr("stroke-opacity", 0.1) 

            const line = d3
                .line()
                .x(d => x(d.miles))
                .y(d => y(d.gas))
          
            svg.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("d", line)
                
            const circles = svg.selectAll(".circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", d => x(d.miles))
                .attr("cy", d => y(d.gas))
                .attr("r", 3)
                .attr("fill", "white")
                .attr("stroke", "black")
                .attr("stroke-width", "1")
            
            svg.selectAll(".text")
                .data(data)
                .enter()
                .append("text")
                .text(d => d.year)
                .attr("x", d => x(d.miles))
                .attr("y", d => y(d.gas))
                .attr("font-size", "9")
                .each(d=> position(d))
                .call(halo)
    
    function position(d) {
        const t = d3.select(this);
        switch (d.side) {
            case "top":
            t.attr("text-anchor", "middle").attr("dy", "-0.7em");
            break;
            case "right":
            t.attr("dx", "0.5em")
                .attr("dy", "0.32em")
                .attr("text-anchor", "start");
            break;
            case "bottom":
            t.attr("text-anchor", "middle").attr("dy", "1.4em");
            break;
            case "left":
            t.attr("dx", "-0.5em")
                .attr("dy", "0.32em")
                .attr("text-anchor", "end");
            break;
        }
    }

    function halo(text) {
        text
          .select(function() {
            return this.parentNode.insertBefore(this.cloneNode(true), this);
          })
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-width", 4)
          .attr("stroke-linejoin", "round");
      }
    
    

}
scatterplot()
