import React from "react";
import ReactDOM from "react-dom";
import {
  DiagramEngine,
  DiagramModel,
  DefaultNodeModel,
  LinkModel,
  DiagramWidget,
  DefaultLinkModel
} from "storm-react-diagrams";

import "./styles.css";

const ElmArchitecture = () => {
  //1) setup the diagram engine
  var engine = new DiagramEngine();
  engine.installDefaultFactories();

  //2) setup the diagram model
  var model = new DiagramModel();

  //3-A) create a default node
  var node1 = new DefaultNodeModel("Model", "rgb(0,192,255)");
  let port1 = node1.addOutPort(" ");
  node1.setPosition(100, 100);

  //3-B) create another default node
  var node2 = new DefaultNodeModel("view", "rgb(192,255,0)");
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

  //5) load model into engine
  engine.setDiagramModel(model);

  //6) render the diagram!
  return <DiagramWidget className="srd-demo-canvas" diagramEngine={engine} />;
};

function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <ElmArchitecture />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
