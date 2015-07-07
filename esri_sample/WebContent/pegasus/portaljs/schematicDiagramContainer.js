/**
 * Main class that acts as a controller to all the schematic diagrams
 * 	- initializes and register's the schematic diagram to controller
 * 	- remove/un-register the schematic diagram from controller
 * 	- retrive the schematic diagram from controller
 * 	- clear/ clears all the schematic diagrams that are registered in controller  
 * @returns {SchematicDiagramContainer}
 */
function SchematicDiagramContainer() {
	this.schematicDiagramsMap = new go.Map("number", SchematicDiagram);
}

/**
 * add/register the schematic diagram 
 * @param diagramId	- ID assigned to the schematic diagram container 
 * @param diagram	- {go.Diagram} object
 */
SchematicDiagramContainer.prototype.addDiagram = function(diagramId, diagram) {
	if(diagramId && diagram) {
		this.schematicDiagramsMap.add(diagramId, diagram);
	}
};

/**
 * un-register / remove the schematic reference from the controller		 
 * @param diagramId	ID assigned to the schematic diagram container
 */
SchematicDiagramContainer.prototype.removeDiagram = function(diagramId) {
	if(this.schematicDiagramsMap.contains(diagramId)) {
		this.schematicDiagramsMap.remove(diagramId);
	}
};

/**
 * retrieve the schematic diagram by ID
 * @param diagramId	ID assigned to the schematic diagram container
 * @returns {go.Diagram}
 */	
SchematicDiagramContainer.prototype.getDiagram = function(diagramId) {
	return this.schematicDiagramsMap.getValue(diagramId);
};

/**
 * clear the schematic diagram container 
 * @param diagramIds
 */
SchematicDiagramContainer.prototype.clear = function(diagramIds) {
	if(diagramIds) {
		for(var i = 0; i < diagramIds.length; i++) {			
			var schematicDiagram = this.schematicDiagramsMap.getValue(diagramIds[i]);
			if(schematicDiagram) {
				schematicDiagram.clear();
			}
		}
	}
};

/**
 * clear(s) all the schematic container...
 */
SchematicDiagramContainer.prototype.clearAll = function() {
	var it = this.schematicDiagramsMap.iterator;
	while (it.next()) {
		it.value.clear();
	}
};