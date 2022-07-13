url = 'https://raw.githubusercontent.com/mattdhill011/web-visualization-challenge/main/samples.json'



// We want to make sure the json is loaded first, so we put everything in the .then function
d3.json(url).then(function(data) {

    function init(id) {

        // Here we pull the data from the json file where 'id' is the index
        let name = data.names[id];
        let metadata = data.metadata[id]
        let sample = data.samples[id]

        let ethnicity = metadata.ethnicity;
        let gender = metadata.gender;
        let age = metadata.age;
        let location = metadata.location;
        let bbtype = metadata.bbtype;
        let wfreq = metadata.wfreq;

        // For the bar graph we only want the to 10, everything is already in order so all we have to do
        // is slice for the first 10 and reverse them to account for plotly's formating.
        let sampleValues = sample.sample_values.slice(0,10).reverse();
        let otuIds = sample.otu_ids.slice(0,10).map(idName).reverse();

        // Plotly kept trying to treat the otuIds as numbers, so we map this function to the array
        // to turn them all into strings
        function idName(ids) {
            return "OTU " + ids.toString();
        }  

        // Here we build the demographics text box
        var demographicInfo = `
        Ethnicity: ${ethnicity}
        Gender: ${gender}
        Age: ${age}
        Location: ${location}
        bbtype: ${bbtype}
        wfreq: ${wfreq}`;

        // Then select the textbox by its ID and put the new text in.
        d3.select("#sample-metadata").text(demographicInfo);
    
        // The trace for the bar chart
        let trace1 = {
            x: sampleValues,
            y: otuIds,
            text: otuIds,
            name: name,
            type: "bar",
            orientation: "h"
        };

        let traceData = [trace1];

        let layout = {
            maring: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        }

        Plotly.newPlot("bar", traceData, layout);


        // The trace for the bubble plot
        var trace2 = {

            // We want the whole dataset for the sample values and otu ids 
            x: sample.otu_ids,
            y: sample.sample_values,
            mode: 'markers',
            marker: {
                size: sample.sample_values,
                color: sample.otu_ids
            },
            text: sample.otu_ids
        };

        var bubbleData = [trace2]

        var bubbleLayout = {
            showlegend: false,
            height: 600,
            width: 1200,
            xaxis: {
                title: {
                    text:"OTU ID"
                }
            }
        };

        Plotly.newPlot('bubble', bubbleData, bubbleLayout)
    }


    // I'm trying to get the dropdown menu to work, but I have no idea how to do that right now

    // The intention is to get the index number of the Id selected and then run the init function again with
    // the new index, but I'm not sure how to get the menu to list all the available ids
    d3.selectAll("#selDataset").on("change", updatePlotly);

    function updatePlotly() {
        var dropdownMenu = d3.select("#selDataset");
        var dataset = dropdownMenu.property("value");

        var newId = 0;

        for (let i = 0; i < data.samples.length; i++) {
            if (dataset === data.samples[i].id) {
                newId = i;
            }
        }

        updatePlotly;
    }

    function updatePlotly(newId) {
        console.log(newId);
    }

    // Here we initialize the graphs with a default ID number
    init(0);
});

