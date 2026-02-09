import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { WebSocketBridge } from '../bridge';

export function registerSchWriteTools(server: McpServer, bridge: WebSocketBridge): void {
	server.tool(
		'sch_create_component',
		'Create a schematic component from a library device reference. Use lib_search_device or lib_get_device first to get the component object.',
		{
			component: z
				.record(z.any())
				.describe(
					'Component object from library search/get (ILIB_DeviceItem or ILIB_DeviceSearchItem), or an object with {deviceUuid, libraryUuid}',
				),
			x: z.number().describe('X coordinate for placement'),
			y: z.number().describe('Y coordinate for placement'),
			subPartName: z.string().optional().describe('Sub-part name for multi-part components'),
			rotation: z.number().optional().describe('Rotation angle in degrees'),
			mirror: z.boolean().optional().describe('Whether to mirror the component'),
			addIntoBom: z.boolean().optional().describe('Whether to include in BOM (default true)'),
			addIntoPcb: z.boolean().optional().describe('Whether to include in PCB (default true)'),
		},
		async (params) => {
			const result = await bridge.send('sch.component.create', params);
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'sch_create_net_flag',
		'Create a Power/Ground/AnalogGround/ProtectGround net flag in the schematic',
		{
			identification: z
				.enum(['Power', 'Ground', 'AnalogGround', 'ProtectGround'])
				.describe('Net flag type'),
			net: z.string().describe('Net name (e.g. "VCC", "GND", "3V3")'),
			x: z.number().describe('X coordinate'),
			y: z.number().describe('Y coordinate'),
			rotation: z.number().optional().describe('Rotation angle in degrees'),
			mirror: z.boolean().optional().describe('Whether to mirror'),
		},
		async (params) => {
			const result = await bridge.send('sch.component.createNetFlag', params);
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'sch_create_net_port',
		'Create an IN/OUT/BI directional net port in the schematic',
		{
			direction: z.enum(['IN', 'OUT', 'BI']).describe('Port direction'),
			net: z.string().describe('Net name'),
			x: z.number().describe('X coordinate'),
			y: z.number().describe('Y coordinate'),
			rotation: z.number().optional().describe('Rotation angle in degrees'),
			mirror: z.boolean().optional().describe('Whether to mirror'),
		},
		async (params) => {
			const result = await bridge.send('sch.component.createNetPort', params);
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'sch_delete_component',
		'Delete one or more schematic components by their primitive IDs',
		{
			ids: z
				.union([z.string(), z.array(z.string())])
				.describe('Single primitive ID or array of primitive IDs to delete'),
		},
		async ({ ids }) => {
			const result = await bridge.send('sch.component.delete', { ids });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'sch_modify_component',
		'Modify properties of a schematic component (position, rotation, designator, etc.)',
		{
			primitiveId: z.string().describe('The component primitive ID'),
			x: z.number().optional().describe('New X coordinate'),
			y: z.number().optional().describe('New Y coordinate'),
			rotation: z.number().optional().describe('New rotation angle in degrees'),
			mirror: z.boolean().optional().describe('Whether to mirror'),
			addIntoBom: z.boolean().optional().describe('Whether to include in BOM'),
			addIntoPcb: z.boolean().optional().describe('Whether to include in PCB'),
			designator: z.string().nullable().optional().describe('New designator (e.g. "R1", "U2")'),
			name: z.string().nullable().optional().describe('New component name'),
			uniqueId: z.string().nullable().optional().describe('New unique ID'),
			manufacturer: z.string().nullable().optional().describe('Manufacturer name'),
			manufacturerId: z.string().nullable().optional().describe('Manufacturer part number'),
			supplier: z.string().nullable().optional().describe('Supplier name'),
			supplierId: z.string().nullable().optional().describe('Supplier part number (e.g. LCSC C-number)'),
		},
		async ({ primitiveId, ...property }) => {
			const result = await bridge.send('sch.component.modify', { primitiveId, property });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'sch_create_wire',
		'Create a wire in the schematic defined by a series of coordinate points',
		{
			line: z
				.union([
					z.array(z.number()).min(4).describe('Flat array of coordinates [x1,y1,x2,y2,...]'),
					z
						.array(z.array(z.number()).length(2))
						.min(2)
						.describe('Array of point pairs [[x1,y1],[x2,y2],...]'),
				])
				.describe('Wire path coordinates'),
			net: z.string().optional().describe('Net name to assign to the wire'),
			color: z.string().nullable().optional().describe('Wire color (null for default)'),
			lineWidth: z.number().nullable().optional().describe('Wire width (null for default)'),
			lineType: z
				.enum(['0', '1', '2', '3'])
				.optional()
				.describe('Line type: 0=Solid, 1=Dashed, 2=Dotted, 3=DotDashed'),
		},
		async ({ lineType, ...rest }) => {
			const params: Record<string, any> = { ...rest };
			if (lineType !== undefined) {
				params.lineType = Number(lineType);
			}
			const result = await bridge.send('sch.wire.create', params);
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'sch_delete_wire',
		'Delete one or more wires by their primitive IDs',
		{
			ids: z
				.union([z.string(), z.array(z.string())])
				.describe('Single primitive ID or array of primitive IDs to delete'),
		},
		async ({ ids }) => {
			const result = await bridge.send('sch.wire.delete', { ids });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'sch_modify_wire',
		'Modify properties of an existing wire',
		{
			primitiveId: z.string().describe('The wire primitive ID'),
			line: z
				.union([z.array(z.number()), z.array(z.array(z.number()))])
				.optional()
				.describe('New wire path coordinates'),
			net: z.string().optional().describe('New net name'),
			color: z.string().nullable().optional().describe('New wire color (null for default)'),
			lineWidth: z.number().nullable().optional().describe('New wire width (null for default)'),
			lineType: z
				.enum(['0', '1', '2', '3'])
				.optional()
				.describe('Line type: 0=Solid, 1=Dashed, 2=Dotted, 3=DotDashed'),
		},
		async ({ primitiveId, lineType, ...rest }) => {
			const property: Record<string, any> = { ...rest };
			if (lineType !== undefined) {
				property.lineType = Number(lineType);
			}
			const result = await bridge.send('sch.wire.modify', { primitiveId, property });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'sch_select_primitives',
		'Select primitives in the schematic editor by their IDs',
		{
			primitiveIds: z
				.union([z.string(), z.array(z.string())])
				.describe('Single primitive ID or array of primitive IDs to select'),
		},
		async ({ primitiveIds }) => {
			const result = await bridge.send('sch.select.select', { primitiveIds });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'sch_clear_selection',
		'Clear all selection in the schematic editor',
		{},
		async () => {
			const result = await bridge.send('sch.select.clear');
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'sch_set_netlist',
		'Update the schematic netlist',
		{
			type: z
				.enum(['Allegro', 'PADS', 'Protel2', 'JLCEDA', 'EasyEDA', 'DISA'])
				.optional()
				.describe('Netlist format type'),
			netlist: z.string().describe('Netlist data string'),
		},
		async ({ type, netlist }) => {
			const result = await bridge.send('sch.netlist.set', { type, netlist });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'sch_save',
		'Save the current schematic document',
		{},
		async () => {
			const result = await bridge.send('sch.document.save');
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'sch_import_changes',
		'Import changes from PCB back into the schematic',
		{},
		async () => {
			const result = await bridge.send('sch.document.importChanges');
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);
}
