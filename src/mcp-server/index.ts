import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { WebSocketBridge } from './bridge';
import { registerReadTools } from './tools/read-tools';
import { registerWriteTools } from './tools/write-tools';
import { registerAnalysisTools } from './tools/analysis-tools';
import { registerSchReadTools } from './tools/sch-read-tools';
import { registerSchWriteTools } from './tools/sch-write-tools';
import { registerLibTools } from './tools/lib-tools';
import { registerManufactureTools } from './tools/manufacture-tools';
import { registerPcbDrcTools } from './tools/pcb-drc-tools';
import { registerPcbLayerTools } from './tools/pcb-layer-tools';

const WS_PORT = Number(process.env.EDA_WS_PORT) || 15168;

async function main() {
	const bridge = new WebSocketBridge(WS_PORT);
	await bridge.start();

	const server = new McpServer({
		name: 'easyeda-agent-mcp-server',
		version: '1.0.0',
	});

	registerReadTools(server, bridge);
	registerWriteTools(server, bridge);
	registerAnalysisTools(server, bridge);
	registerSchReadTools(server, bridge);
	registerSchWriteTools(server, bridge);
	registerLibTools(server, bridge);
	registerManufactureTools(server, bridge);
	registerPcbDrcTools(server, bridge);
	registerPcbLayerTools(server, bridge);

	const transport = new StdioServerTransport();
	await server.connect(transport);

	console.error('[MCP] EasyEDA Agent MCP Server started');
	console.error(`[MCP] WebSocket Server on port ${WS_PORT}, waiting for EDA Pro Extension...`);

	process.on('SIGINT', async () => {
		await bridge.stop();
		process.exit(0);
	});

	process.on('SIGTERM', async () => {
		await bridge.stop();
		process.exit(0);
	});
}

main().catch((err) => {
	console.error('[MCP] Fatal error:', err);
	process.exit(1);
});
