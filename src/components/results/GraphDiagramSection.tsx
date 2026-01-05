import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, GitBranch, Network, ArrowRight, Binary, List, RotateCcw, Move } from "lucide-react";
import { useCallback, useMemo, useState, useRef, useEffect } from "react";

interface Node {
  id: string;
  label: string;
  level?: number;
}

interface Edge {
  from: string;
  to: string;
  label?: string;
}

interface GraphDiagram {
  title: string;
  type: "binary-tree" | "tree" | "graph" | "directed" | "flowchart" | "linked-list";
  description?: string;
  nodes: Node[];
  edges: Edge[];
}

interface GraphDiagramSectionProps {
  diagrams: GraphDiagram[];
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "binary-tree":
    case "tree":
      return <Binary className="w-4 h-4" />;
    case "linked-list":
      return <List className="w-4 h-4" />;
    case "directed":
    case "flowchart":
      return <ArrowRight className="w-4 h-4" />;
    default:
      return <Network className="w-4 h-4" />;
  }
};

const calculateInitialLayout = (
  nodes: Node[],
  type: string
): Record<string, { x: number; y: number }> => {
  const nodePositions: Record<string, { x: number; y: number }> = {};
  const width = 600;
  const height = 400;
  const padding = 60;

  if (type === "linked-list") {
    const nodeWidth = (width - 2 * padding) / Math.max(nodes.length, 1);
    nodes.forEach((node, index) => {
      nodePositions[node.id] = {
        x: padding + nodeWidth * index + nodeWidth / 2,
        y: height / 2,
      };
    });
  } else if (type === "binary-tree" || type === "tree") {
    const levels: Record<number, Node[]> = {};
    nodes.forEach((node) => {
      const level = node.level ?? 0;
      if (!levels[level]) levels[level] = [];
      levels[level].push(node);
    });

    const levelKeys = Object.keys(levels).map(Number).sort((a, b) => a - b);
    const maxLevel = Math.max(...levelKeys, 0);
    const levelHeight = (height - 2 * padding) / Math.max(maxLevel + 1, 1);

    levelKeys.forEach((level) => {
      const levelNodes = levels[level];
      const levelWidth = (width - 2 * padding) / Math.max(levelNodes.length, 1);
      levelNodes.forEach((node, index) => {
        nodePositions[node.id] = {
          x: padding + levelWidth * index + levelWidth / 2,
          y: padding + level * levelHeight + 30,
        };
      });
    });
  } else {
    const angleStep = (2 * Math.PI) / Math.max(nodes.length, 1);
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - padding - 20;

    nodes.forEach((node, index) => {
      const angle = angleStep * index - Math.PI / 2;
      nodePositions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
  }

  return nodePositions;
};

interface GraphVisualizationProps {
  diagram: GraphDiagram;
  positions: Record<string, { x: number; y: number }>;
  onPositionChange: (nodeId: string, x: number, y: number) => void;
  onReset: () => void;
}

const GraphVisualization = ({ diagram, positions, onPositionChange, onReset }: GraphVisualizationProps) => {
  const { nodes, edges, type } = diagram;
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const isDirected = type === "directed" || type === "flowchart" || type === "linked-list";

  const getSVGCoordinates = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    return { x: svgP.x, y: svgP.y };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    const coords = getSVGCoordinates(e);
    const nodePos = positions[nodeId];
    if (nodePos) {
      setDragOffset({
        x: coords.x - nodePos.x,
        y: coords.y - nodePos.y,
      });
      setDraggingNode(nodeId);
    }
  }, [positions, getSVGCoordinates]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingNode) return;
    
    const coords = getSVGCoordinates(e);
    const newX = Math.max(30, Math.min(570, coords.x - dragOffset.x));
    const newY = Math.max(30, Math.min(370, coords.y - dragOffset.y));
    onPositionChange(draggingNode, newX, newY);
  }, [draggingNode, dragOffset, onPositionChange, getSVGCoordinates]);

  const handleMouseUp = useCallback(() => {
    setDraggingNode(null);
  }, []);

  useEffect(() => {
    if (draggingNode) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingNode, handleMouseMove, handleMouseUp]);

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-md">
          <Move className="w-3 h-3" />
          Drag nodes
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="h-7 px-2 gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </Button>
      </div>
      
      <svg 
        ref={svgRef}
        viewBox="0 0 600 400" 
        className={`w-full h-auto bg-muted/20 rounded-lg ${draggingNode ? 'cursor-grabbing' : ''}`}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
          </marker>
          <filter id="node-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
          <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="hsl(var(--primary))" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Edges */}
        {edges.map((edge, index) => {
          const from = positions[edge.from];
          const to = positions[edge.to];
          if (!from || !to) return null;

          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance === 0) return null;
          
          const nodeRadius = 25;
          const startX = from.x + (dx / distance) * nodeRadius;
          const startY = from.y + (dy / distance) * nodeRadius;
          const endX = to.x - (dx / distance) * (nodeRadius + (isDirected ? 8 : 0));
          const endY = to.y - (dy / distance) * (nodeRadius + (isDirected ? 8 : 0));

          return (
            <g key={`edge-${index}`}>
              <line
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                markerEnd={isDirected ? "url(#arrowhead)" : undefined}
                className="transition-all duration-150"
              />
              {edge.label && (
                <text
                  x={(startX + endX) / 2}
                  y={(startY + endY) / 2 - 8}
                  textAnchor="middle"
                  className="text-xs fill-muted-foreground"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const pos = positions[node.id];
          if (!pos) return null;
          const isDragging = draggingNode === node.id;

          return (
            <g 
              key={node.id}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
              className={`cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
              style={{ transition: isDragging ? 'none' : 'transform 0.15s ease-out' }}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isDragging ? 28 : 25}
                fill="hsl(var(--primary))"
                filter={isDragging ? "url(#node-glow)" : "url(#node-shadow)"}
                className="transition-all duration-150"
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium fill-primary-foreground pointer-events-none select-none"
              >
                {node.label.length > 6 ? node.label.slice(0, 6) + "…" : node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const DiagramCard = ({ diagram, index }: { diagram: GraphDiagram; index: number }) => {
  const initialLayout = useMemo(
    () => calculateInitialLayout(diagram.nodes, diagram.type),
    [diagram.nodes, diagram.type]
  );

  const [positions, setPositions] = useState(initialLayout);

  const handlePositionChange = useCallback((nodeId: string, x: number, y: number) => {
    setPositions((prev) => ({
      ...prev,
      [nodeId]: { x, y },
    }));
  }, []);

  const handleReset = useCallback(() => {
    setPositions(initialLayout);
  }, [initialLayout]);

  const handleExport = useCallback(() => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${diagram.title}</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; padding: 40px; }
            h1 { color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
            .description { color: #666; margin-bottom: 20px; }
            .section { margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #6366f1; color: white; }
          </style>
        </head>
        <body>
          <h1>${diagram.title}</h1>
          ${diagram.description ? `<p class="description">${diagram.description}</p>` : ''}
          <p><strong>Type:</strong> ${diagram.type}</p>
          
          <div class="section">
            <h3>Nodes</h3>
            <table>
              <thead><tr><th>ID</th><th>Label</th><th>Level</th></tr></thead>
              <tbody>
                ${diagram.nodes.map(n => `<tr><td>${n.id}</td><td>${n.label}</td><td>${n.level ?? '-'}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <h3>Edges (Connections)</h3>
            <table>
              <thead><tr><th>From</th><th>To</th><th>Label</th></tr></thead>
              <tbody>
                ${diagram.edges.map(e => `<tr><td>${e.from}</td><td>${e.to}</td><td>${e.label || '-'}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  }, [diagram]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          {getTypeIcon(diagram.type)}
          <CardTitle className="text-lg font-semibold">{diagram.title}</CardTitle>
          <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
            {diagram.type}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        {diagram.description && (
          <p className="text-sm text-muted-foreground mb-4">{diagram.description}</p>
        )}
        <GraphVisualization 
          diagram={diagram} 
          positions={positions}
          onPositionChange={handlePositionChange}
          onReset={handleReset}
        />
        <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
          <span>Nodes: {diagram.nodes.length}</span>
          <span>Edges: {diagram.edges.length}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export const GraphDiagramSection = ({ diagrams }: GraphDiagramSectionProps) => {
  if (!diagrams || diagrams.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <GitBranch className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No graph theory diagrams generated for these notes.</p>
        <p className="text-sm mt-2">Diagrams are created when notes contain trees, graphs, linked lists, or flowcharts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {diagrams.map((diagram, index) => (
        <DiagramCard key={index} diagram={diagram} index={index} />
      ))}
    </div>
  );
};
