import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, GitBranch, Network, ArrowRight, Binary, List } from "lucide-react";
import { useCallback, useMemo } from "react";

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

const GraphVisualization = ({ diagram }: { diagram: GraphDiagram }) => {
  const { nodes, edges, type } = diagram;

  const layout = useMemo(() => {
    const nodePositions: Record<string, { x: number; y: number }> = {};
    const width = 600;
    const height = 400;
    const padding = 60;

    if (type === "linked-list") {
      // Horizontal layout for linked list
      const nodeWidth = (width - 2 * padding) / Math.max(nodes.length, 1);
      nodes.forEach((node, index) => {
        nodePositions[node.id] = {
          x: padding + nodeWidth * index + nodeWidth / 2,
          y: height / 2,
        };
      });
    } else if (type === "binary-tree" || type === "tree") {
      // Tree layout - group nodes by level
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
      // Circular layout for graphs
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
  }, [nodes, type]);

  const isDirected = type === "directed" || type === "flowchart" || type === "linked-list";

  return (
    <svg viewBox="0 0 600 400" className="w-full h-auto bg-muted/20 rounded-lg">
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
      </defs>

      {/* Edges */}
      {edges.map((edge, index) => {
        const from = layout[edge.from];
        const to = layout[edge.to];
        if (!from || !to) return null;

        // Calculate edge endpoints (offset from node center to avoid overlap)
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
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
        const pos = layout[node.id];
        if (!pos) return null;

        return (
          <g key={node.id}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={25}
              fill="hsl(var(--primary))"
              className="drop-shadow-md"
            />
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-medium fill-primary-foreground"
            >
              {node.label.length > 6 ? node.label.slice(0, 6) + "…" : node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export const GraphDiagramSection = ({ diagrams }: GraphDiagramSectionProps) => {
  const handleExport = useCallback((diagram: GraphDiagram) => {
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
  }, []);

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
        <Card key={index} className="overflow-hidden">
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
              onClick={() => handleExport(diagram)}
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
            <GraphVisualization diagram={diagram} />
            <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
              <span>Nodes: {diagram.nodes.length}</span>
              <span>Edges: {diagram.edges.length}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
