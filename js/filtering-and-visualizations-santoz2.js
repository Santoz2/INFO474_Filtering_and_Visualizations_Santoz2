
// for more about line graphs check out this example:
// https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89

const margin = { top: 50, right: 50, bottom: 50, left: 50 }
    , width = 800 - margin.left - margin.right // Use the window's width 
    , height = 600 - margin.top - margin.bottom // Use the window's height

// load data
d3.csv('data/gapminder.csv').then((data) => {

    // append the div which will be the tooltip
    const div = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    // make an svg and append it to body
    const svg = d3.select('body').append("svg")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);


    const tooltipSvg = div.append("svg")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    //Removes data with null populations
    data = data.filter(d => d['population'] != "NA");

    // get only data for the year 1980
    const data1980 = data.filter(d => d['year'] == "1980");

    // get fertility min and max for us
    const fertilityLimits = d3.extent(data1980, d => d['fertility'])

    // get min and max life expectancy for US
    const lifeExpectancyLimits = d3.extent(data1980, d => d['life_expectancy'])




    // get scaling function for fertilitys (x axis)
    const xScale = d3.scaleLinear()
        .domain([fertilityLimits[0], fertilityLimits[1]])
        .range([margin.left, width + margin.left])

    // get scaling function for life expectancy y axis
    const yScale = d3.scaleLinear()
        .domain([lifeExpectancyLimits[1], lifeExpectancyLimits[0]])
        .range([margin.top, margin.top + height])





    // make fertility x axis for main graph
    const xAxis = svg.append("g")
        .attr("transform", "translate(0," + (height + margin.top) + ")")
        .call(d3.axisBottom(xScale));

    // make life expectancy y axis for main graph
    const yAxis = svg.append("g")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(yScale));




    // get only data for the US
    const dataUS = data.filter(d => d['country'] == "United States");
    

    // get time min and max for us
    const timeLimits = d3.extent(dataUS, d => d['year']);

    // get min and max population for US
    const populationLimits = d3.extent(dataUS, d => d['population']);


    // get scaling function for time (x axis)
    const xScaleTooltip = d3.scaleLinear()
        .domain([timeLimits[0], timeLimits[1]])
        .range([margin.left, width + margin.left]);

    // get scaling function for population y axis
    const yScaleTooltip = d3.scaleLinear()
        .domain([populationLimits[1], populationLimits[0]])
        .range([margin.top, margin.top + height]);

    //console.log(timeLimits)
    //console.log(populationLimits)


    // make tooltip x axis
    const tooltipXAxis = tooltipSvg.append("g")
        .attr("transform", "translate(0," + (height + margin.top) + ")")
        .call(d3.axisBottom(xScaleTooltip));

    // make tooltip y axis
    const tooltipYAxis = tooltipSvg.append("g")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(yScaleTooltip));





    // d3's line generator
    const line = d3.line()
        .x(d => xScaleTooltip(d['year'])) // set the x values for the line generator
        .y(d => yScaleTooltip(d['population'])) // set the y values for the line generator 


    /*        
        // append line to svg
        svg.append("path")
            // difference between data and datum:
            // https://stackoverflow.com/questions/13728402/what-is-the-difference-d3-datum-vs-data
            .datum(data)
            .attr("d", function (d) { return line(d) })
            .attr("fill", "steelblue")
            .attr("stroke", "steelblue")
    */


    // append line to svg
    tooltipSvg.append("path")
        // difference between data and datum:
        // https://stackoverflow.com/questions/13728402/what-is-the-difference-d3-datum-vs-data
        .datum(dataUS)
        .attr("d", function (d) { return line(d) })
        .attr("fill", "steelblue")
        .attr("stroke", "steelblue")

    // append dots to svg to track data points
    svg.selectAll('.dot').data(data1980)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d['fertility']))
        .attr('cy', d => yScale(d['life_expectancy']))
        .attr('r', 4)
        .attr('fill', 'steelblue')
        .on("mouseover", function (d) {
            div.transition()
                .duration(200)
                .style('opacity', 0.9)

            div.style('left', d3.event.pageX + "px")
                .style('top', (d3.event.pageY - 28) + "px")
        })
        .on("mouseout", function (d) {
            div.transition()
                .duration(300)
                .style('opacity', 0)
        })


    /*
        //new
        let year2000 = data.filter(function (d) { return +d['year'] > 2000 })
        console.log(year2000);
    
        svg.selectAll('.text')
            .data(year2000)
            .enter()
            .append('text')
            .attr('x', function (d) { return xScale(+d['fertility']) })
            .attr('y', function (d) { return yScale(+d['life_expectancy']) - 20 })
            .text(function (d) { return d['infant_mortality'] })
    
    */

})