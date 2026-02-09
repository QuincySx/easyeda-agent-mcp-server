import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { WebSocketBridge } from '../bridge';

export function registerPcbPrimitiveTools(server: McpServer, bridge: WebSocketBridge): void {
	// === Via Modify ===

	server.tool(
		'pcb_modify_via',
		'Modify properties of an existing via',
		{
			primitiveId: z.string().describe('The via primitive ID'),
			net: z.string().optional().describe('New net name'),
			x: z.number().optional().describe('New X coordinate'),
			y: z.number().optional().describe('New Y coordinate'),
			holeDiameter: z.number().optional().describe('New hole diameter'),
			diameter: z.number().optional().describe('New via pad diameter'),
			viaType: z.string().optional().describe('New via type'),
			primitiveLock: z.boolean().optional().describe('Lock status'),
		},
		async ({ primitiveId, ...property }) => {
			const result = await bridge.send('pcb.modify.via', { primitiveId, property });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	// === Polyline Modify ===

	server.tool(
		'pcb_modify_polyline_track',
		'Modify properties of an existing polyline track',
		{
			primitiveId: z.string().describe('The polyline primitive ID'),
			net: z.string().optional().describe('New net name'),
			layer: z.string().optional().describe('New layer'),
			lineWidth: z.number().optional().describe('New track width'),
			primitiveLock: z.boolean().optional().describe('Lock status'),
		},
		async ({ primitiveId, ...property }) => {
			const result = await bridge.send('pcb.modify.polyline', { primitiveId, property });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	// === Component Delete ===

	server.tool(
		'pcb_delete_component',
		'Delete one or more PCB components by their primitive IDs',
		{
			ids: z
				.union([z.string(), z.array(z.string())])
				.describe('Single primitive ID or array of IDs to delete'),
		},
		async ({ ids }) => {
			const result = await bridge.send('pcb.delete.component', { ids });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	// === Pad CRUD ===

	server.tool(
		'pcb_create_pad',
		'Create a standalone pad on the PCB',
		{
			layer: z.string().describe('Pad layer'),
			padNumber: z.string().describe('Pad number/name'),
			x: z.number().describe('X coordinate'),
			y: z.number().describe('Y coordinate'),
			rotation: z.number().optional().describe('Rotation angle in degrees'),
			net: z.string().optional().describe('Net name'),
			primitiveLock: z.boolean().optional().describe('Whether to lock'),
		},
		async (params) => {
			const result = await bridge.send('pcb.create.pad', params);
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_modify_pad',
		'Modify properties of an existing pad',
		{
			primitiveId: z.string().describe('The pad primitive ID'),
			x: z.number().optional().describe('New X coordinate'),
			y: z.number().optional().describe('New Y coordinate'),
			rotation: z.number().optional().describe('New rotation'),
			net: z.string().optional().describe('New net name'),
			padNumber: z.string().optional().describe('New pad number'),
			layer: z.string().optional().describe('New layer'),
			primitiveLock: z.boolean().optional().describe('Lock status'),
		},
		async ({ primitiveId, ...property }) => {
			const result = await bridge.send('pcb.modify.pad', { primitiveId, property });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_delete_pads',
		'Delete one or more pads by their primitive IDs',
		{
			ids: z
				.union([z.string(), z.array(z.string())])
				.describe('Single primitive ID or array of IDs to delete'),
		},
		async ({ ids }) => {
			const result = await bridge.send('pcb.delete.pad', { ids });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	// === Arc CRUD ===

	server.tool(
		'pcb_get_all_arcs',
		'Get all arc segments on the PCB, optionally filtered by net and layer',
		{
			net: z.string().optional().describe('Filter by net name'),
			layer: z.string().optional().describe('Filter by layer'),
		},
		async ({ net, layer }) => {
			const result = await bridge.send('pcb.getAll.arc', { net, layer });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_create_arc',
		'Create an arc track segment on the PCB',
		{
			net: z.string().describe('Net name'),
			layer: z.string().describe('Layer name'),
			startX: z.number().describe('Start X coordinate'),
			startY: z.number().describe('Start Y coordinate'),
			endX: z.number().describe('End X coordinate'),
			endY: z.number().describe('End Y coordinate'),
			arcAngle: z.number().describe('Arc angle in degrees'),
			lineWidth: z.number().optional().describe('Track width'),
			primitiveLock: z.boolean().optional().describe('Whether to lock'),
		},
		async (params) => {
			const result = await bridge.send('pcb.create.arc', params);
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_modify_arc',
		'Modify properties of an existing arc segment',
		{
			primitiveId: z.string().describe('The arc primitive ID'),
			net: z.string().optional().describe('New net name'),
			layer: z.string().optional().describe('New layer'),
			startX: z.number().optional().describe('New start X'),
			startY: z.number().optional().describe('New start Y'),
			endX: z.number().optional().describe('New end X'),
			endY: z.number().optional().describe('New end Y'),
			arcAngle: z.number().optional().describe('New arc angle'),
			lineWidth: z.number().optional().describe('New track width'),
			primitiveLock: z.boolean().optional().describe('Lock status'),
		},
		async ({ primitiveId, ...property }) => {
			const result = await bridge.send('pcb.modify.arc', { primitiveId, property });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_delete_arcs',
		'Delete one or more arc segments by their primitive IDs',
		{
			ids: z
				.union([z.string(), z.array(z.string())])
				.describe('Single primitive ID or array of IDs to delete'),
		},
		async ({ ids }) => {
			const result = await bridge.send('pcb.delete.arc', { ids });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	// === Region CRUD ===

	server.tool(
		'pcb_get_all_regions',
		'Get all design rule regions on the PCB, optionally filtered by layer and rule type',
		{
			layer: z.string().optional().describe('Filter by layer'),
			ruleType: z.array(z.string()).optional().describe('Filter by rule type(s)'),
		},
		async ({ layer, ruleType }) => {
			const result = await bridge.send('pcb.getAll.region', { layer, ruleType });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_create_region',
		'Create a design rule region (keepout/constraint area) on the PCB',
		{
			layer: z.string().describe('Layer name'),
			polygon: z
				.array(z.union([z.string(), z.number()]))
				.describe('Polygon source array, e.g. ["L", x1, y1, x2, y2, ..., x1, y1]'),
			ruleType: z.array(z.string()).optional().describe('Rule type(s) for the region'),
			regionName: z.string().optional().describe('Name for the region'),
			lineWidth: z.number().optional().describe('Outline width'),
			primitiveLock: z.boolean().optional().describe('Whether to lock'),
		},
		async (params) => {
			const result = await bridge.send('pcb.create.region', params);
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_modify_region',
		'Modify properties of an existing design rule region',
		{
			primitiveId: z.string().describe('The region primitive ID'),
			layer: z.string().optional().describe('New layer'),
			ruleType: z.array(z.string()).optional().describe('New rule type(s)'),
			regionName: z.string().optional().describe('New region name'),
			lineWidth: z.number().optional().describe('New outline width'),
			primitiveLock: z.boolean().optional().describe('Lock status'),
		},
		async ({ primitiveId, ...property }) => {
			const result = await bridge.send('pcb.modify.region', { primitiveId, property });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_delete_regions',
		'Delete one or more design rule regions by their primitive IDs',
		{
			ids: z
				.union([z.string(), z.array(z.string())])
				.describe('Single primitive ID or array of IDs to delete'),
		},
		async ({ ids }) => {
			const result = await bridge.send('pcb.delete.region', { ids });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	// === Fill Create / Modify (Pour already has create in pour-fill-tools) ===

	server.tool(
		'pcb_create_fill',
		'Create a fill region on the PCB',
		{
			layer: z.string().describe('Layer name'),
			polygon: z
				.array(z.union([z.string(), z.number()]))
				.describe('Polygon source array, e.g. ["L", x1, y1, x2, y2, ..., x1, y1]'),
			net: z.string().optional().describe('Net name'),
			fillMode: z.string().optional().describe('Fill mode'),
			lineWidth: z.number().optional().describe('Line width'),
			primitiveLock: z.boolean().optional().describe('Whether to lock'),
		},
		async (params) => {
			const result = await bridge.send('pcb.create.fill', params);
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_modify_fill',
		'Modify properties of an existing fill region',
		{
			primitiveId: z.string().describe('The fill primitive ID'),
			layer: z.string().optional().describe('New layer'),
			net: z.string().optional().describe('New net'),
			fillMode: z.string().optional().describe('New fill mode'),
			lineWidth: z.number().optional().describe('New line width'),
			primitiveLock: z.boolean().optional().describe('Lock status'),
		},
		async ({ primitiveId, ...property }) => {
			const result = await bridge.send('pcb.modify.fill', { primitiveId, property });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_modify_pour',
		'Modify properties of an existing copper pour',
		{
			primitiveId: z.string().describe('The pour primitive ID'),
			net: z.string().optional().describe('New net'),
			layer: z.string().optional().describe('New layer'),
			pourFillMethod: z
				.enum(['solid', '45grid', '90grid'])
				.optional()
				.describe('Fill method'),
			preserveSilos: z.boolean().optional().describe('Preserve copper islands'),
			pourName: z.string().optional().describe('Pour name'),
			pourPriority: z.number().optional().describe('Pour priority'),
			lineWidth: z.number().optional().describe('Line width'),
			primitiveLock: z.boolean().optional().describe('Lock status'),
		},
		async ({ primitiveId, ...property }) => {
			const result = await bridge.send('pcb.modify.pour', { primitiveId, property });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);
}
