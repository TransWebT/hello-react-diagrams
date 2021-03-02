import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import createEngine, {
  DiagramEngine,
  DiagramModel,
  DefaultNodeModel,
  DefaultPortModel,
  NodeModel,
  LinkModel,
  DiagramWidget,
  DagreEngine,
  DefaultLinkModel,
  PathFindingLinkFactory
} from "storm-react-diagrams";
import "./styles.css";


function createNode(name) {
	return new DefaultNodeModel(name, 'rgb(0,192,255)');
}

let count = 0;

function connectNodes(nodeFrom, nodeTo, engine) {
	//just to get id-like structure
	count++;
	const portOut = nodeFrom.addPort(new DefaultPortModel(true, `${nodeFrom.name}-out-${count}`, 'Out'));
	const portTo = nodeTo.addPort(new DefaultPortModel(false, `${nodeFrom.name}-to-${count}`, 'IN'));
	return portOut.link(portTo);

	// ################# UNCOMMENT THIS LINE FOR PATH FINDING #############################
	// return portOut.link(portTo, engine.getLinkFactories().getFactory(PathFindingLinkFactory.NAME));
	// #####################################################################################
}

const ElmArchitecture = () => {
  //1) setup the diagram engine
  var engine = new DiagramEngine();
  // let engine = createEngine();
  engine.installDefaultFactories();

  //2) setup the diagram model
  var model = new DiagramModel();
	let nodesFrom: NodeModel[] = [];
	let nodesTo: NodeModel[] = [];

	nodesFrom.push(createNode('from-1'));
	nodesFrom.push(createNode('from-2'));
	nodesFrom.push(createNode('from-3'));

	nodesTo.push(createNode('to-1'));
	nodesTo.push(createNode('to-2'));
	nodesTo.push(createNode('to-3'));

	//4) link nodes together
	let links = nodesFrom.map((node, index) => {
		return connectNodes(node, nodesTo[index], engine);
	});

	// more links for more complicated diagram
	links.push(connectNodes(nodesFrom[0], nodesTo[1], engine));
	links.push(connectNodes(nodesTo[0], nodesFrom[1], engine));
	links.push(connectNodes(nodesFrom[1], nodesTo[2], engine));

	// initial random position
	nodesFrom.forEach((node, index) => {
		node.setPosition(index * 70, index * 70);
		model.addNode(node);
	});

	nodesTo.forEach((node, index) => {
		node.setPosition(index * 70, 100);
		model.addNode(node);
	});

	links.forEach((link) => {
		model.addLink(link);
	});


  /*
  //3-A) create a default node
  var node1 = new DefaultNodeModel("Model", "rgb(0,192,255)");
  let port1 = node1.addOutPort(" ");
  node1.setPosition(100, 100);

  //3-B) create another default node
  var node2 = new DefaultNodeModel("view2", "rgb(192,255,0)");
  let port2 = node2.addInPort("Model");
  let port3 = node2.addOutPort("Html");
  node2.setPosition(400, 100);

  //3-C) create yet another default node
  var node3 = new DefaultNodeModel("view", "rgb(192,0,192)");
  let port4 = node3.addInPort("Model");
  let port5 = node3.addOutPort("Html");
  node2.setPosition(600, 100);

  // link the ports
  let link1 = port1.link(port2);
  let link2 = port3.link(port4);
  //link1.addLabel("Hello World!");

  //4) add the models to the root graph
  model.addAll(node1, node2, node3, link1, link2);
*/

  //5) load model into engine
  engine.setDiagramModel(model);
  // engine.setModel(model);


  //6) render the diagram!
  return <DiagramWidget className="srd-demo-canvas" diagramEngine={engine} />;
};

function App() {
  return (
    <div className="App">
      <h1>Database Schema Diagrammer</h1>
      <h2>Read and Graph Database Design</h2>
      <ElmArchitecture />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
