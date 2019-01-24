function loadChart() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState === 4 && this.status === 200){
            let scatterParams = getChartParams(this.response,'scatter');
            let histogramParams = getChartParams(this.response, 'histogram');
            let tableParams = getChartParams(this.response, 'table');
            Plotly.newPlot('scatter', scatterParams.data, scatterParams.layout);
            Plotly.newPlot('histogram', histogramParams.data, histogramParams.layout);
            Plotly.newPlot('table', tableParams.data, tableParams.layout);
        }
    };
    xhttp.open("GET", "/data");
    xhttp.send();

}

function setupScatterplotData(objOfData) {
    let years0 = [];
    let temps0 = [];
    for (let item of objOfData['ny annual temps']) {
        years0.push(item[0]);
        temps0.push(item[1]);
    }

    var trace1 = {
    name: 'NYC Annual Avg. Temp. (\u2109)',
    x: years0,
    y: temps0,
    color: 'red',
    mode: 'markers',
    type: 'scatter'
};

var trace2 = {
    name: 'NYC Temp. Trend Line',
    x: objOfData['ny endpoints'][0],
    y: objOfData['ny endpoints'][1],
    mode: 'lines',
    type: 'scatter'
};

var trace3 = {
    name: 'US Temp. Trend Line',
    x: objOfData['us endpoints'][0],
    y: objOfData['us endpoints'][1],
    mode: 'lines',
    type: 'scatter'
};

var trace4 = {
    name: 'NYC Avg Temp. 1895-2017' + ' (' + objOfData['long term avg'].toString() + '\u2109)',
    x: [1895, 2017],
    y: [objOfData['long term avg'], objOfData['long term avg']],
    line: {
      color: 'grey',
      width: 1,
      dash: 'longdash'
    },
    mode: 'lines',
    type: 'scatter'
};

var data = [trace1, trace2, trace3, trace4];
return data;
}


function setupScatterplotLayout(obj0) {
    var layout = {
    xaxis: {
        range: [1894, 2018],
        title: 'Year'
    },
    yaxis: {
        mirror: true, 
        range: [50, 60], 
        showline: true, 
        ticklen: 4, 
        title: 'Temp. (\u2109)', 
  }, 
    yaxis2: {
        range: [50, 60], 
        side: 'right', 
        ticklen: 4, 
        title: 'Temp. (\u2109)', 
  },
    title:'Annual Average Temperature in NYC (Central Park), 1895-2017'
};
    return layout;
}


function setupHistogramData(totalData) {
    let nyY1 = totalData['ny endpoints'][1][0];
    let nyY2 = totalData['ny endpoints'][1][1];
    
    let nyDiff = (nyY2 - nyY1).toFixed(3);
    
    let usY1 = totalData['us endpoints'][1][0];
    let usY2 = totalData['us endpoints'][1][1];
    
    let usDiff = (usY2 - usY1).toFixed(3);
    
    
    var trace1 = {
    x: ['NYC (Central Park)', 'United States'],
    y: [nyDiff, usDiff],
    type: 'bar',
    text: ['+' + nyDiff.toString() + ' (\u2109)', '+' + usDiff.toString() + ' (\u2109)'],
    marker: {
    color: 'rgb(300,30,30)'
  }
};

    var data = [trace1];
    return data;
}

function setupHistogramLayout(dataDict) {
    var layout = {
    title: 'Average Increase in Temperature in NYC (Central Park) vs in the US from 1895 to 2017',
    font:{
        family: 'Raleway, sans-serif'
    },
    showlegend: false,
    xaxis: {
        tickangle: -45
    },
    yaxis: {
        zeroline: false,
        gridwidth: 2,
        title: 'Temp. (\u2109)'
  },
    bargap :0.05
};
    return layout;
}

function setupTableData(allData00) {
    let warmest = allData00['ny temp records']['warmest years'];
    let coolest = allData00['ny temp records']['coolest years'];
    
    var values = [
      ['1st', '2nd', '3rd']
      ];
    
    
    var loopList0 = [];
    for (var i = 1; i < 4; i = i + 1) {
        loopList0.push(warmest[i.toString()][0][0])
    }
    values.push(loopList0);

    var loopList1 = [];   
    for (var m = 1; m < 4; m = m + 1) {     
        loopList1.push(coolest[m.toString()][0][0]);
        }
    values.push(loopList1);

    var data = [{
    type: 'table',
    header: {
        values: [["Rank"], ["Warmest Years"],
				 ["Coolest Years"]],
        align: ["left", "center"],
        line: {width: 1, color: '#506784'},
        fill: {color: '#ee3221'},
        font: {family: "Arial", size: 12, color: "white"}
    },
    cells: {
        values: values,
        align: ["left", "center"],
        line: {color: "#f9b5af", width: 1},
	    fill: {color: ['f9b5af', 'f9b5af']},
        font: {family: "Arial", size: 11, color: ["#506784"]}
    }
    }];
    return data;
}

function setupTableLayout(data00) {
    var layout = {
    title: "NYC Annual Average Temperature Records (1895-2017)"
}
    return layout;
}


function getChartParams(jsonStr, chartType) {
    let obj1 = {};
    let allData1 = JSON.parse(jsonStr);
    
    if (chartType === 'scatter') {
        obj1['data'] = setupScatterplotData(allData1);
        obj1['layout'] = setupScatterplotLayout(allData1);
    }
    if (chartType === 'histogram') {
        obj1['data'] = setupHistogramData(allData1);
        obj1['layout'] = setupHistogramLayout(allData1);
    }
    if (chartType === 'table') {
        obj1['data'] = setupTableData(allData1);
        obj1['layout'] = setupTableLayout(allData1);
    }
    return obj1;
}