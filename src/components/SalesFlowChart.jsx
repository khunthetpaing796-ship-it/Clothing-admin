import React from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

const nodes = [
  { id: '1', position: { x: 100, y: 50 }, data: { label: '🛒 Order Placed' }, type: 'input' },
  { id: '2', position: { x: 100, y: 180 }, data: { label: '✅ Payment Verified' } },
  { id: '3', position: { x: 100, y: 310 }, data: { label: '📦 Packing' } },
  { id: '4', position: { x: 100, y: 440 }, data: { label: '🚚 Shipped' } },
  { id: '5', position: { x: 100, y: 570 }, data: { label: '🎉 Delivered' }, type: 'output' },
];

const edges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5' },
];

function SalesFlowChart() {
  return (
    <div style={{ height: '400px', width: '100%' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default SalesFlowChart;