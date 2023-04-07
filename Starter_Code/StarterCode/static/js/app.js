// Use the D3 library to read in samples.json from the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function init() {
    var selector = d3.select("#selDataset");
  
    d3.json(url).then((data) => {
      var sample_values = data.names;
  
      sample_values.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      var firstSample = sample_values[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
  // Demographic information 
  function buildMetadata(sample) {
    d3.json(url).then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
  
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  
  // Create a Horizontal Bar Chart
  function buildCharts(sample) {
    d3.json(url).then((data) => {
      console.log(data);

      var barLayout = {

      }

      var samplesArray = data.samples;
      var resultArray = samplesArray.filter(sampleObj => sampleObj.id == sample);
  
      var metadataArray = data.metadata;
      var resultMetadata = metadataArray.filter(sampleObj => sampleObj.id == sample);
  
      var firstSample = resultArray[0];
      console.log(firstSample);
  
      var firstMetadata = resultMetadata[0];
      console.log(firstMetadata);
  
      var otuIds = firstSample.otu_ids;
      var otuLabels = firstSample.otu_labels;
      var sampleValues = firstSample.sample_values;
  
      var wFreq = parseFloat(firstMetadata.wfreq);
  
      var yticks = otuIds.slice(0, 10).map(id => "OTU " + id + " ").reverse();
  
      var barData = [{
        x: sampleValues.slice(0, 10).reverse(),
        y: yticks,
        text: otuLabels.slice(0, 10).reverse(),
        type: "bar",
        orientation:"h",
        marker: {
          color: sampleValues.slice(0, 10).reverse(),
          colorscale: "electric"
        }
        }];
    
      Plotly.newPlot("bar", barData, barLayout);
    
  
      var bubbleData = [{
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        type: "scatter",
        mode: "markers",
        marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: ""
        }
      }];
  
      var bubbleLayout = {
        xaxis: {title: "OTU ID"},
        margins: {
          l: 0,
          r: 0,
          b: 0,
          t: 0     
        },
      };
  
      Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  
      var gaugeData = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: wFreq,
        title: {text: "Belly Button Washing Frequency: Scrubs per Week", font: {size: 10}},
        type: "indicator",
        mode: "gauge+number",
        
        gauge: {
          axis: {
            range: [0, 10]},
          steps: [
            {range: [0, 1], color: "purple"},
            {range: [1, 2], color: "purple"},
            {range: [2, 3], color: "red"},
            {range: [3, 4], color: "red"},
            {range: [4, 5], color: "orange"},
            {range: [5, 6], color: "orange"},
            {range: [6, 7], color: "yellow"},
            {range: [7, 8], color: "yellow"},
            {range: [8, 9], color: "green"},
            {range: [9, 10], color: "green"},
          ]}
      }];
      
      var gaugeLayout = { 
        width: 400, 
        height: 550,
        margin: {t: 0, r: 0, l: 0, b: 0}
      };
  
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  
  
    });
  }