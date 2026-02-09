import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { WebSocketBridge } from '../bridge';

export function registerPourFillTools(server: McpServer, bridge: WebSocketBridge): void {
	server.tool(
		'pcb_get_all_pours',
		'Get all copper pour regions on the PCB, optionally filtered by net and layer',
		{
			net: z.string().optional().describe('Filter by net name'),
			layer: z.string().optional().describe('Filter by layer'),
		},
		async ({ net, layer }) => {
			const result = await bridge.send('pcb.getAll.pour', { net, layer });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_create_pour',
		'Create a copper pour region on the PCB. The polygon should be a flat array like ["L", x1, y1, x2, y2, ..., x1, y1] where "L" indicates line segments.',
		{
			net: z.string().describe('Net name for the pour'),
			layer: z.string().describe('Layer name (e.g. "TopLayer", "BottomLayer", "InnerLayer1", "InnerLayer2")'),
			polygon: z
				.array(z.union([z.string(), z.number()]))
				.describe('Polygon source array, e.g. ["L", x1, y1, x2, y2, ..., x1, y1]'),
			pourFillMethod: z
				.enum(['solid', '45grid', '90grid'])
				.optional()
				.describe('Fill method: "solid", "45grid", or "90grid"'),
			preserveSilos: z.boolean().optional().describe('Whether to preserve copper islands'),
			pourName: z.string().optional().describe('Name for the pour region'),
			pourPriority: z.number().optional().describe('Pour priority (higher = poured first)'),
			lineWidth: z.number().optional().describe('Line width'),
			primitiveLock: z.boolean().optional().describe('Whether to lock the pour'),
		},
		async (params) => {
			const result = await bridge.send('pcb.create.pour', params);
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_delete_pours',
		'Delete copper pour regions by their IDs',
		{
			ids: z.array(z.string()).describe('Array of pour primitive IDs to delete'),
		},
		async ({ ids }) => {
			const result = await bridge.send('pcb.delete.pour', { ids });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_get_all_fills',
		'Get all fill regions on the PCB, optionally filtered by layer and net',
		{
			layer: z.string().optional().describe('Filter by layer'),
			net: z.string().optional().describe('Filter by net name'),
		},
		async ({ layer, net }) => {
			const result = await bridge.send('pcb.getAll.fill', { layer, net });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_delete_fills',
		'Delete fill regions by their IDs',
		{
			ids: z.array(z.string()).describe('Array of fill primitive IDs to delete'),
		},
		async ({ ids }) => {
			const result = await bridge.send('pcb.delete.fill', { ids });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);
}
