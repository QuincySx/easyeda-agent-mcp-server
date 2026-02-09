import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { WebSocketBridge } from '../bridge';

export function registerAnalysisTools(server: McpServer, bridge: WebSocketBridge): void {
	server.tool(
		'pcb_highlight_net',
		'Highlight a specific net in the PCB editor for visual inspection',
		{
			net: z.string().describe('Net name to highlight'),
		},
		async ({ net }) => {
			const result = await bridge.send('pcb.net.highlight', { net });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_select_net',
		'Select all primitives of a specific net in the PCB editor',
		{
			net: z.string().describe('Net name to select'),
		},
		async ({ net }) => {
			const result = await bridge.send('pcb.net.select', { net });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_navigate_to',
		'Navigate the PCB editor viewport to specific coordinates',
		{
			x: z.number().describe('X coordinate to navigate to'),
			y: z.number().describe('Y coordinate to navigate to'),
		},
		async ({ x, y }) => {
			const result = await bridge.send('pcb.document.navigateTo', { x, y });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_navigate_to_region',
		'Navigate and zoom the PCB editor viewport to fit a specific region',
		{
			left: z.number().describe('Left boundary X'),
			right: z.number().describe('Right boundary X'),
			top: z.number().describe('Top boundary Y'),
			bottom: z.number().describe('Bottom boundary Y'),
		},
		async ({ left, right, top, bottom }) => {
			const result = await bridge.send('pcb.document.navigateToRegion', { left, right, top, bottom });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_zoom_to_board',
		'Zoom the viewport to fit the entire board outline',
		{},
		async () => {
			const result = await bridge.send('pcb.document.zoomToBoardOutline');
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_get_primitive_at_point',
		'Get the primitive at a specific point on the PCB',
		{
			x: z.number().describe('X coordinate'),
			y: z.number().describe('Y coordinate'),
		},
		async ({ x, y }) => {
			const result = await bridge.send('pcb.document.getPrimitiveAtPoint', { x, y });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_get_primitives_in_region',
		'Get all primitives within a rectangular region on the PCB',
		{
			left: z.number().describe('Left boundary X'),
			right: z.number().describe('Right boundary X'),
			top: z.number().describe('Top boundary Y'),
			bottom: z.number().describe('Bottom boundary Y'),
			leftToRight: z
				.boolean()
				.optional()
				.describe('true=must be fully inside, false=intersecting also counts'),
		},
		async ({ left, right, top, bottom, leftToRight }) => {
			const result = await bridge.send('pcb.document.getPrimitivesInRegion', {
				left, right, top, bottom, leftToRight,
			});
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_canvas_origin',
		'Get or set the canvas origin offset relative to data origin',
		{
			action: z.enum(['get', 'set']).describe('"get" to read, "set" to write'),
			offsetX: z.number().optional().describe('X offset (required for set)'),
			offsetY: z.number().optional().describe('Y offset (required for set)'),
		},
		async ({ action, offsetX, offsetY }) => {
			if (action === 'get') {
				const result = await bridge.send('pcb.document.getCanvasOrigin');
				return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
			}
			const result = await bridge.send('pcb.document.setCanvasOrigin', { offsetX, offsetY });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_convert_coordinates',
		'Convert between canvas coordinates and data coordinates',
		{
			direction: z.enum(['canvasToData', 'dataToCanvas']).describe('Conversion direction'),
			x: z.number().describe('X coordinate'),
			y: z.number().describe('Y coordinate'),
		},
		async ({ direction, x, y }) => {
			const method =
				direction === 'canvasToData'
					? 'pcb.document.convertCanvasToData'
					: 'pcb.document.convertDataToCanvas';
			const result = await bridge.send(method, { x, y });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_import_changes',
		'Import changes from schematic into the PCB (sync schematic to PCB)',
		{
			uuid: z.string().optional().describe('Schematic UUID (uses associated schematic if not provided)'),
		},
		async ({ uuid }) => {
			const result = await bridge.send('pcb.document.importChanges', { uuid });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);
}
