// I can not run a local file, so I link to the file as it appears on my github page
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

        // Here we put in the options for the database selector
        var idNames = data.names;

        // Now we build the drop down menu, first starting with an empty string
        var selectIdList = ''

        // Then looping through the list of id names we add a line of html code that
        // denotes an option with value equal to the index and text equal to the id name.        
        for (let i = 0; i < idNames.length; i++) {
            selectIdList += `<option value=${i}>${data.names[i]}</option>`;
        }

        // Once done, we insert that html into the selDataset div
        d3.select("#selDataset").html(selectIdList);

        // Here we build the metadata demographics text box
        var demographicInfo = `
        <p>
            Ethnicity: ${ethnicity}<br>
            Gender: ${gender}<br>
            Age: ${age}<br>
            Location: ${location}<br>
            bbtype: ${bbtype}<br>
            wfreq: ${wfreq}
        </p>`;

        // Then select the textbox by its ID and put the new html formated text in.
        d3.select("#sample-metadata").html(demographicInfo);

        // For the bar graph we only want the to 10, everything is already in order so all we have to do
        // is slice for the first 10 and reverse them to account for plotly's formating.
        let sampleValues = sample.sample_values.slice(0,10).reverse();
        let otuIds = sample.otu_ids.slice(0,10).map(idName).reverse();

        // Plotly kept trying to treat the otuIds as numbers, so we map this function to the array
        // to turn them all into strings
        function idName(ids) {
            return "OTU " + ids.toString();
        }        
    
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

            // We use the idName function we used earlier to change the id names to text
            text: sample.otu_ids.map(idName)
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
    };


    // Here we initialize the graphs with a default ID number
    init(0);
});

d3.selectAll("#selDataset").on("change", optionChanged);

function optionChanged(value) {
    updatePlotly(value);
};


function updatePlotly(newdata) {

    d3.json(url).then(function(data) {
    
        let name = data.names[id];
        let metadata = data.metadata[id]
        let sample = data.samples[id]

        let ethnicity = metadata.ethnicity;
        let gender = metadata.gender;
        let age = metadata.age;
        let location = metadata.location;
        let bbtype = metadata.bbtype;
        let wfreq = metadata.wfreq;

        var demographicInfo = `
            <p>
                Ethnicity: ${ethnicity}<br>
                Gender: ${gender}<br>
                Age: ${age}<br>
                Location: ${location}<br>
                bbtype: ${bbtype}<br>
                wfreq: ${wfreq}
            </p>`;

        d3.select("#sample-metadata").html(demographicInfo);
    });
};