class DataControls {
    constructor(app, vfData, uiNodeArray, uiNodeTemplateArray, nodes, container) {
        this.app = app;
        this.container = container;
        this.vfData = vfData;
        this.uiNodeArray = uiNodeArray;
        this.uiNodeTemplateArray = uiNodeTemplateArray;
        this.nodes = nodes;
    }

    loadJSON() {
        const fileUrl = "js/model/saveTestData.json";

        fetch(fileUrl)
            .then(response => response.json())
            .then(jsonData => {
                console.log(jsonData);

                // Example: Output the name from the Header
                this.vfData = jsonData.vfData;

                // Assign json data to internal Nodes & Connection Data
                this.nodes = jsonData.vfData.Nodes;
                this.app.uiControls.connections = this.vfData.Connections;

                // Loop through each node and create a NodeBox object
                Object.keys(this.nodes).forEach(index => {
                    const node = this.nodes[index];

                    const nodeBox = new NodeBox(app, node);
                    this.uiNodeArray.push(nodeBox);
                    this.container.addChild(nodeBox);
                });

                //this.app.uiControls.connections = this.connections;
                this.app.uiControls.updateConnections(this.uiNodeArray);
                //this.exportJSON();
            })
            .catch(error => console.error(error));
    }

    loadMenuData(menu) {
      const fileUrl = 'js/model/TemplateNodes.json';

      fetch(fileUrl)
          .then(response => response.json())
          .then(jsonData => {
        
        // Extract the array from the JSON data
        this.uiNodeTemplateArray = jsonData.TemplateNodes;

        // Call your function and pass the array
        menu.features = this.uiNodeTemplateArray;
        menu.addFeatures();

        //this.app.uiNodeTemplateArray = this.uiNodeTemplateArray;
        this.app.uiControls.updateTemplateData(this.uiNodeTemplateArray);
        })
        .catch(error => console.error(error));
    }

    exportJSON() {
        const filePath = "js/saves/savedTest01.json";
        const jsonData = { vfData: this.vfData };
    
        fetch(filePath, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(jsonData)
        })
          .then(response => {
            if (response.ok) {
              console.log("JSON data exported successfully!");
            } else {
              console.error("Failed to export JSON data:", response.status, response.statusText);
            }
          })
          .catch(error => console.error("Failed to export JSON data:", error));
      }

      getNodes() {

      }
  
      addNode(app, data) {
  
      }
  
      deleteNode(app, id) {
  
      }

      transformJson(jsonData) {
        if (Array.isArray(jsonData)) {
            // If the data is an array, map its elements and apply transformations
            return jsonData.map(element => this.transformJson(element));
        } else if (typeof jsonData === 'object') {
            // If the data is an object, recursively transform its properties
            const transformedObject = {};
            for (const key in jsonData) {
                if (jsonData.hasOwnProperty(key)) {
                    transformedObject[key] = this.transformJson(jsonData[key]);
                }
            }
            return transformedObject;
        } else {
            // If the data is neither an array nor an object, perform the string-to-int transformation if applicable
            if (!isNaN(jsonData)) {
                return Number(jsonData);
            }
            return jsonData;
        }
    }

    logDataTypes(jsonData, path = '') {
      if (Array.isArray(jsonData)) {
          console.log(`${path}: Array`);
          jsonData.forEach((element, index) => {
              this.logDataTypes(element, `${path}[${index}]`);
          });
      } else if (typeof jsonData === 'object') {
          console.log(`${path}: Object`);
          for (const key in jsonData) {
              if (jsonData.hasOwnProperty(key)) {
                  this.logDataTypes(jsonData[key], `${path}.${key}`);
              }
          }
      } else {
          console.log(`${path}: ${typeof jsonData}`);
      }
  }
  
}