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

                // Access and manipulate the parsed JSON data here

                // Example: Output the name from the Header
                this.vfData = jsonData.vfData;
                //console.log('Name:', vfData.Nodes);

                this.nodes = jsonData.vfData.Nodes;

                // Loop through each node and create a NodeBox object
                Object.keys(this.nodes).forEach(nodeName => {
                    const node = this.nodes[nodeName];
                    const nodeBox = new NodeBox(app, node, node.Type, nodeName);
                    this.uiNodeArray.push(nodeBox);
                    this.container.addChild(nodeBox);
                    console.log('NodeRKA:', JSON.stringify(node));

                });
                this.app.uiControls.updateConnections(this.uiNodeArray);
                //this.exportJSON();
            })
            .catch(error => console.error(error));
    }

    loadMenuData(menu) {
      const fileUrl = 'js/model/TemplateData.json';

      fetch(fileUrl)
          .then(response => response.json())
          .then(jsonData => {
        
        // Extract the array from the JSON data
        this.uiNodeTemplateArray = jsonData.TemplateNodes;
        
        // Call your function and pass the array
        menu.features = this.uiNodeTemplateArray;
        menu.addFeatures();

        console.log('Data loaded and processed successfully!' + JSON.stringify(this.uiNodeTemplateArray));
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
  
}