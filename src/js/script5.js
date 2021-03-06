var svg = d3.select("svg");
var margin = {top: 20, right: 20, bottom: 30, left: 40};
var width = +svg.attr("width") - margin.left - margin.right;
var height = +svg.attr("height") - margin.top - margin.bottom;

var monthsArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

for (var i = 1756; i <= 2015; i++) {
    var compareYear1 = document.getElementById("compareYear1");
    var opt1 = document.createElement('option');
    opt1.value = i;
    opt1.innerHTML = i;
    compareYear1.appendChild(opt1);

    var compareYear2 = document.getElementById("compareYear2");
    var opt2 = document.createElement('option');
    opt2.value = i;
    opt2.innerHTML = i;
    compareYear2.appendChild(opt2);
}

/* Variable that holds the data used to visualize the chart */
var data = d3.nest()
    .key(function(d) { return +d.year;})
    .rollup(function(d) { 
        return d3.mean(d, function(g) {return g.adj; });
    }).entries(json_data);
    //console.log(data);

/* Create the chart area and move it to the correct position in the svg graph */
var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* Update x and y scaling */
var x = d3.scaleLinear().rangeRound([0, width]);
var y = d3.scaleLinear().rangeRound([height, 0]);

/* Define the x and y domains */
x.domain([1756, 2015]);
y.domain([0, d3.max(data, function(d) { return d.value; })]);

/* Create the axes */
var xAxis = d3.axisBottom(x)
                .tickSize(5)
                .tickFormat(function(d){if (d % 10 == 0) {return d;}})
                .tickPadding(3)
                .ticks(26);
var yAxis = d3.axisLeft(y)
                .tickSize(5)
                .tickPadding(3)
                .ticks(20);

/* Tooltip box */
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

/* Append the axes */
g.append("g")
    .classed("x axis", true)
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
g.append("g")
    .classed("y axis", true)
    .attr("transform", "translate(-1,0)")
    .call(yAxis)

/* Append the bars */
g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.key); })
    .attr("y", function(d) { return y(d.value); })
    .attr("width", 3)
    .attr("height", function(d) { return height - y(d.value); })
    .style("fill", function(d) { 
            if (d.value < 0) {
                return "steelblue";
            } else {
                return "red";
            }
        })
    .on("click", function(d){
        console.log(d.key);
        sortByChosenYear(d.key);
    })
    .on("mouseover", function(d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html("Year: " + d.key + "<br/>" + "Temp: " + Math.round(d.value * 100) / 100 + " &#8451;")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
    .on("mouseout", function(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
       });

/* Updates the chart to show the mean temperature each year */
function sortByYear() {
    var dataYear = d3.nest()
    .key(function(d) { return +d.year;})
    .rollup(function(d) { 
        return d3.mean(d, function(g) {return g.adj; });
    }).entries(json_data);

    g.selectAll(".bar").data(dataYear)
        .on("click", function(d){
            console.log(d.key);
            sortByChosenYear(d.key);
        })
        .on("mouseover", function(d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html("Year: " + d.key + "<br/>" + "Temp: " + Math.round(d.value * 100) / 100 + " &#8451;")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
    x.domain([1756, 2015]);
    y.domain([0, d3.max(dataYear, function(d) { return d.value; })]);
    xAxis = d3.axisBottom(x)
                .tickSize(5)
                .tickFormat(function(d){if (d % 10 == 0) {return d;}})
                .tickPadding(3)
                .ticks(26);
    yAxis = d3.axisLeft(y)
                .tickSize(5)
                .tickPadding(3)
                .ticks(20);
        
    var svg2 = d3.select("svg").transition();
    svg2.selectAll(".bar")   // change the bars
        .duration(750)
        .attr("x", function(d) { return x(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", 3)
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", function(d) { 
            if (d.value < 0) {
                return "steelblue";
            } else {
                return "red";
            }
        });
    svg2.select(".x.axis") // change the x axis
        .duration(750)
        .call(xAxis);
    svg2.select(".y.axis") // change the y axis
        .duration(750)
        .call(yAxis);
}

/* Updates the chart to show the mean temperature over a specified month each year */
function sortByMonth(month) {
    var newData = json_data.filter(function (entry){
                return entry.month == month;
            });

    var datamonth = d3.nest()
        .key(function(d) { return +d.year;
        })
        .rollup(function(d) { 
            return d3.mean(d, function(g) {
                return g.adj; 
            });
        }).entries(newData);

    g.selectAll(".bar").data(datamonth)
        .on("click", function(d){
            console.log(d.key);
            sortByChosenYear(d.key);
        })
        .on("mouseover", function(d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html("Year: " + d.key + "<br/>" + "Temp: " + Math.round(d.value * 100) / 100 + " &#8451;")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
    
    // Scale the range of the data again
    x.domain([1756, 2015]);
    y.domain([Math.min(d3.min(datamonth, function(d) { return d.value; }), 0), d3.max(datamonth, function(d) { return d.value; })]);
    /* Update the axes */
    xAxis = d3.axisBottom(x)
                    .tickSize(5)
                    .tickFormat(function(d){if (d % 10 == 0) {return d;}})
                    .tickPadding(3)
                    .ticks(26);
    yAxis = d3.axisLeft(y)
                    .tickSize(5)
                    .tickPadding(3)
                    .ticks(20);

    // Make the changes
    var svg2 = d3.select("svg").transition();
    svg2.selectAll(".bar")   // change the bars
        .duration(750)
        .attr("x", function(d) { return x(d.key); })
        .attr("y", function(d) { 
            if (d.value < 0) {
                return y(0);
            } else {
                return y(d.value);
            }
        })
        .attr("width", 3)
        .attr("height", function(d) { 
            if (d.value < 0) {
                return y(d.value) - y(0);
            } else {
                return Math.abs(y(d.value) - y(0));
            } 
        })
        .style("fill", function(d) { 
            if (d.value < 0) {
                return "steelblue";
            } else {
                return "red";
            }
        });
    svg2.select(".x.axis") // change the x axis
        .duration(750)
        .call(xAxis);
    svg2.select(".y.axis") // change the y axis
        .duration(750)
        .call(yAxis);
    }

function sortByChosenYear(year) {
    var newData = json_data.filter(function (entry){
                return entry.year == year;
            });

    console.log(newData);

    var groupedData = d3.nest()
        .key(function(d) { return +d.month;
        })
        .rollup(function(d) { 
            return d3.mean(d, function(g) {
                return g.adj; 
            });
        }).entries(newData);

        console.log(groupedData);

    g.selectAll(".bar").data(groupedData)
    .on("click", null)
    .on("mouseover", function(d) {
    tooltip.transition()
        .duration(200)
        .style("opacity", .9);
    tooltip.html("Month: " + monthsArray[d.key-1] + "<br/>" + "Temp: " + Math.round(d.value * 100) / 100 + " &#8451;")
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });
    
    // Scale the range of the data again
    //x = d3.scaleTime();

    //x.domain([new Date(2017,0,1), new Date(2017, 11, 31)]);
    x.domain([0.5, 12.9])
    console.log(x.domain());
    y.domain([Math.min(d3.min(groupedData, function(d) { return d.value; }), 0), d3.max(groupedData, function(d) { return d.value; })]);
    /* Update the axes */
    xAxis = d3.axisBottom(x)
                    .tickSize(5)
                    .ticks(12)
                    .tickFormat(function(d){ {return monthsArray[d-1];}})
                    //.tickFormat(function(d){if (d % 10 == 0) {return d;}})
                    .tickPadding(3)
                    //.ticks(26);
                    //.ticks(d3.time.months)
                    //.tickFormat(d3.timeFormat("%B"));
    yAxis = d3.axisLeft(y)
                    .tickSize(5)
                    .tickPadding(3)
                    .ticks(20);

    // Make the changes
    var svg2 = d3.select("svg").transition();
    svg2.selectAll(".bar")   // change the bars
        .duration(750)
        .attr("x", function(d) { return x(d.key)-width/26; })
        .attr("y", function(d) { 
            if (d.value < 0) {
                return y(0);
            } else {
                return y(d.value);
            }
        })
        .attr("width", width/13)
        .attr("height", function(d) { 
            if (d.value < 0) {
                return y(d.value) - y(0);
            } else {
                return Math.abs(y(d.value) - y(0));
            } 
        })
        .style("fill", function(d) { 
            if (d.value < 0) {
                return "steelblue";
            } else {
                return "red";
            }
        });
    svg2.select(".x.axis") // change the x axis
        .duration(750)
        .call(xAxis);
    svg2.select(".y.axis") // change the y axis
        .duration(750)
        .call(yAxis);
    }

// Update data section on click of button in HTML
function updateData() {
    var chosenMonth = document.getElementById('monthSelection').selectedIndex;
    if (chosenMonth == 0) {
        sortByYear();
    } else {
        sortByMonth(chosenMonth);
    }
}



    var popup = document.getElementById('popup');
    //popup.style.display='block';
    //document.getElementById('fade').style.display='block';
    var compareYear1 = document.getElementById('compareYear1').value;
    var compareYear2 = document.getElementById('compareYear2').value;

    //document.getElementById("explYear1").innerHTML = compareYear1;// = "heehj";
    //console.log(color1);
    //document.getElementById("explYear2").innerHTML = compareYear2;// = "heehj";

    var newData1 = json_data.filter(function (entry){
        return entry.year == compareYear1;// && entry.month == compareMonth1 + 1;
    });
    console.log(newData1);

    var meanData1 = d3.nest()
        .key(function(d) { return +d.month;
        })
        .rollup(function(d) { 
            return d3.mean(d, function(g) {
                return g.adj; 
            });
        }).entries(newData1);

    console.log(meanData1);

    var newData2 = json_data.filter(function (entry){
        return entry.year == compareYear2;// && entry.month == compareMonth2 + 1;
    });
    console.log(newData2);

    var meanData2 = d3.nest()
        .key(function(d) { return +d.month;
        })
        .rollup(function(d) { 
            return d3.mean(d, function(g) {
                return g.adj; 
            });
        }).entries(newData2);

    console.log(meanData2);
    console.log(typeof meanData2);


    var innerSVG = d3.select("#popup").append("svg").attr("id", "innerSVG").attr("width", 750).attr("height", 350);
    var innerWidth = 750 - margin.left - margin.right;
    var innerHeight = 350 - margin.top - margin.bottom;
        /* Create the chart area and move it to the correct position in the svg graph */
    var innerG = innerSVG.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    /* Update x and y scaling */
    var innerX = d3.scaleLinear().rangeRound([0, innerWidth]);
    var innerY = d3.scaleLinear().rangeRound([innerHeight, 0]);

    /* Define the x and y domains */
    innerX.domain([0.5, 12.9]);


    var min1 = Math.min(d3.min(meanData1, function(d) { return d.value; }), 0);
    var min2 = Math.min(d3.min(meanData2, function(d) { return d.value; }), 0);
    var max1 = d3.max(meanData1, function(d) { return d.value; });
    var max2 = d3.max(meanData2, function(d) { return d.value; });

    innerY.domain([Math.min(Math.min(min1, min2), 0), Math.max(max1, max2)]);

    /* Create the axes */
    var innerxAxis = d3.axisBottom(innerX)
                    .tickSize(5)
                    .ticks(12)
                    .tickFormat(function(d){ {return monthsArray[d-1];}})
                    //.tickFormat(function(d){if (d % 10 == 0) {return d;}})
                    .tickPadding(3);
    var inneryAxis = d3.axisLeft(innerY)
                    .tickSize(5)
                    .tickPadding(3)
                    .ticks(20);


    /* Tooltip box */
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    /* Append the axes */
    innerG.append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0," + innerHeight + ")")
        .call(innerxAxis);
    innerG.append("g")
        .classed("y axis", true)
        .attr("transform", "translate(-1,0)")
        .call(inneryAxis);

    /* Append the bars */
    innerG.selectAll(".year1.bar")
        .data(meanData1)
        .enter().append("rect")
        .attr("class", "year1 bar")
        .attr("x", function(d) { return innerX(d.key)-innerWidth/26; })
        .attr("y", function(d) { 
            if (d.value < 0) {
                return innerY(0);
            } else {
                return innerY(d.value);
            }
        })
        .attr("width", innerWidth/13/2)
        .attr("height", function(d) { 
            if (d.value < 0) {
                return innerY(d.value) - innerY(0);
            } else {
                return Math.abs(innerY(d.value) - innerY(0));
            } 
        })
        .style("fill", function(d) { 
            if (d.value < 0) {
                return "steelblue";
            } else {
                return "red";
            }
        })
        .on("click", function(d){
            console.log(d.key);
        })
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(monthsArray[d.key-1] + ", " + compareYear1 + "<br/>" + "Temp: " + Math.round(d.value * 100) / 100 + " &#8451;")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
           });




        innerG.selectAll(".year2.bar")
        .data(meanData2)
        .enter().append("rect")
        .attr("class", "year2 bar")
        .attr("x", function(d) { return innerX(d.key)-innerWidth/26+innerWidth/13/2; })
        .attr("y", function(d) { 
            if (d.value < 0) {
                return innerY(0);
            } else {
                return innerY(d.value);
            }
        })
        .attr("width", innerWidth/13/2)
        .attr("height", function(d) { 
            if (d.value < 0) {
                return innerY(d.value) - innerY(0);
            } else {
                return Math.abs(innerY(d.value) - innerY(0));
            } 
        })
        .style("fill", function(d) { 
            if (d.value < 0) {
                return "blue";
            } else {
                return "darkred";
            }
        })
        .on("click", function(d){
            console.log(d.key);
        })
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(monthsArray[d.key-1] + ", " + compareYear2 + "<br/>" + "Temp: " + Math.round(d.value * 100) / 100 + " &#8451;")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
           });


/*

    //NEW CODE TO COMPARE!!!!!!!
    // Scale the range of the data again
    //x = d3.scaleTime();

    //x.domain([new Date(2017,0,1), new Date(2017, 11, 31)]);
    x.domain([0.5, 12.9])
    console.log(x.domain());
    y.domain([Math.min(d3.min(meanData1, function(d) { return d.value; }), 0), d3.max(meanData1, function(d) { return d.value; })]);
    /* Update the axes 
    xAxis = d3.axisBottom(x)
                    .tickSize(5)
                    .ticks(12)
                    .tickFormat(function(d){ {return monthsArray[d-1];}})
                    //.tickFormat(function(d){if (d % 10 == 0) {return d;}})
                    .tickPadding(3)
                    //.ticks(26);
                    //.ticks(d3.time.months)
                    //.tickFormat(d3.timeFormat("%B"));
    yAxis = d3.axisLeft(y)
                    .tickSize(5)
                    .tickPadding(3)
                    .ticks(20);

    svg.select(".x.axis") // change the x axis
        .transition()
        .duration(750)
        .call(xAxis);
    svg.select(".y.axis") // change the y axis
        .transition()
        .duration(750)
        .call(yAxis);


    svg.selectAll(".bar").data(null)
    .on("click", null)
    .on("mouseover", function(d) {
    tooltip.transition()
        .duration(200)
        .style("opacity", .9);
    tooltip.html("Month: " + monthsArray[d.key-1] + "<br/>" + "Temp: " + Math.round(d.value * 100) / 100 + " &#8451;")
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });
    
    // Make the changes
    //var svg2 = d3.select("svg").transition();
    svg.transition().selectAll(".bar")   // change the bars
        .duration(750)
        .attr("x", function(d) { return x(d.key)-width/26; })
        .attr("y", function(d) { 
            if (d.value < 0) {
                return y(0);
            } else {
                return y(d.value);
            }
        })
        .attr("width", width/13)
        .attr("height", function(d) { 
            if (d.value < 0) {
                return y(d.value) - y(0);
            } else {
                return Math.abs(y(d.value) - y(0));
            } 
        })
        .style("fill", function(d) { 
            if (d.value < 0) {
                return "steelblue";
            } else {
                return "red";
            }
        });
        */
    
    

    //var meanData1 = d3.mean(newData1, function(d) {return d.adj; });
    //console.log(meanData1);

    /*var newData2 = json_data.filter(function (entry){
        return entry.year == compareYear2 && entry.month == compareMonth2 + 1;
    });
    console.log(newData2);

    var meanData2 = d3.mean(newData2, function(d) {return d.adj; });
    console.log(meanData2);
    */

    //popup.innerHTML = monthsArray[compareMonth1] + ", " + compareYear1 + ": " + Math.round(meanData1 * 100) / 100 + " &#8451;" + "<br>" 
      //                  + monthsArray[compareMonth2] + ", " + compareYear2 + ": " + Math.round(meanData2 * 100) / 100 + " &#8451;";
    //popup.innerHTML = monthsArray[compareMonth2] + ", " + compareYear2 + ": " + meanData2;



function updateCompare() {
    var popup = document.getElementById('popup');
    //var innerSVG = d3.select("#innerSVG");
    popup.style.display='block';
    document.getElementById('fade').style.display='block';
    var compareYear1 = document.getElementById('compareYear1').value;
    var compareYear2 = document.getElementById('compareYear2').value;

    var updateNewData1 = json_data.filter(function (entry){
        return entry.year == compareYear1;// && entry.month == compareMonth1 + 1;
    });
    console.log(updateNewData1);

    var updateMeanData1 = d3.nest()
        .key(function(d) { return +d.month;
        })
        .rollup(function(d) { 
            return d3.mean(d, function(g) {
                return g.adj; 
            });
        }).entries(updateNewData1);

    console.log(updateMeanData1);

    var newData2 = json_data.filter(function (entry){
        return entry.year == compareYear2;// && entry.month == compareMonth2 + 1;
    });
    console.log(newData2);

    var meanData2 = d3.nest()
        .key(function(d) { return +d.month;
        })
        .rollup(function(d) { 
            return d3.mean(d, function(g) {
                return g.adj; 
            });
        }).entries(newData2);

    console.log(meanData2);
    console.log(typeof meanData2);

    var updateMin1 = Math.min(d3.min(updateMeanData1, function(d) { return d.value; }), 0);
    var updateMin2 = Math.min(d3.min(meanData2, function(d) { return d.value; }), 0);
    var updateMax1 = d3.max(updateMeanData1, function(d) { return d.value; });
    var updateMax2 = d3.max(meanData2, function(d) { return d.value; });

    innerY.domain([Math.min(Math.min(updateMin1, updateMin2), 0), Math.max(updateMax1, updateMax2)]);

    innerG.selectAll(".year1.bar")
        .data(updateMeanData1)
        .on("click", function(d){
            console.log(d.key);
            console.log("haai");
        })
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(monthsArray[d.key-1] + ", " + compareYear1 + "<br/>" + "Temp: " + Math.round(d.value * 100) / 100 + " &#8451;")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
           });


    innerG.selectAll(".year2.bar")
        .data(meanData2)
        .on("click", function(d){
            console.log(d.key);
        })
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(monthsArray[d.key-1] + ", " + compareYear2 + "<br/>" + "Temp: " + Math.round(d.value * 100) / 100 + " &#8451;")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
           });


        /* Create the axes */
        var innerxAxis = d3.axisBottom(innerX)
                    .tickSize(5)
                    .ticks(12)
                    .tickFormat(function(d){ {return monthsArray[d-1];}})
                    //.tickFormat(function(d){if (d % 10 == 0) {return d;}})
                    .tickPadding(3);
        var inneryAxis = d3.axisLeft(innerY)
                    .tickSize(5)
                    .tickPadding(3)
                    .ticks(20);

        innerSVG.select(".x.axis") // change the x axis
            .transition()
            .duration(750)
            .call(innerxAxis);
        innerSVG.select(".y.axis") // change the y axis
            .transition()
            .duration(750)
            .call(inneryAxis);

        innerSVG.transition().selectAll(".year1.bar").duration(750)
            .attr("x", function(d) { return innerX(d.key)-innerWidth/26; })
            .attr("y", function(d) { 
                if (d.value < 0) {
                    return innerY(0);
                } else {
                    return innerY(d.value);
                }
            })
            .attr("width", innerWidth/13/2)
            .attr("height", function(d) { 
                if (d.value < 0) {
                    return innerY(d.value) - innerY(0);
                } else {
                    return Math.abs(innerY(d.value) - innerY(0));
                } 
            })
            .style("fill", function(d) { 
                if (d.value < 0) {
                    return "steelblue";
                } else {
                    return "red";
                }
            });

        innerSVG.transition().selectAll(".year2.bar").duration(750)
            .attr("x", function(d) { return innerX(d.key)-innerWidth/26+innerWidth/13/2; })
            .attr("y", function(d) { 
                if (d.value < 0) {
                    return innerY(0);
                } else {
                    return innerY(d.value);
                }
            })
            .attr("width", innerWidth/13/2)
            .attr("height", function(d) { 
                if (d.value < 0) {
                    return innerY(d.value) - innerY(0);
                } else {
                    return Math.abs(innerY(d.value) - innerY(0));
                } 
            })
            .style("fill", function(d) { 
                if (d.value < 0) {
                    return "blue";
                } else {
                    return "darkred";
                }
            });

}