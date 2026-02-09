import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { WebSocketBridge } from '../bridge';

const EXPORT_HANDLER_MAP: Record<string, string> = {
	dsn: 'pcb.manufacture.getDsnFile',
	autoroute_json: 'pcb.manufacture.getAutoRouteJsonFile',
	autolayout_json: 'pcb.manufacture.getAutoLayoutJsonFile',
	gerber: 'pcb.manufacture.getGerberFile',
	bom: 'pcb.manufacture.getBomFile',
	pick_and_place: 'pcb.manufacture.getPickAndPlaceFile',
	'3d': 'pcb.manufacture.get3DFile',
	pdf: 'pcb.manufacture.getPdfFile',
	netlist: 'pcb.manufacture.getNetlistFile',
	dxf: 'pcb.manufacture.getDxfFile',
	altium: 'pcb.manufacture.getAltiumDesignerFile',
	pads: 'pcb.manufacture.getPadsFile',
};

const IMPORT_HANDLER_MAP: Record<string, string> = {
	autoroute_json: 'pcb.manufacture.importAutoRouteJson',
	autolayout_json: 'pcb.manufacture.importAutoLayoutJson',
	autoroute_ses: 'pcb.manufacture.importAutoRouteSes',
};

export function registerManufactureTools(server: McpServer, bridge: WebSocketBridge): void {
	server.tool(
		'pcb_export',
		`Export the PCB design in various formats. Returns { fileName, data (Base64), size }.
Formats: dsn (for FreeRouting), gerber (manufacturing), bom (bill of materials), pick_and_place (assembly),
3d (STEP/OBJ), pdf, netlist, dxf, altium, pads, autoroute_json, autolayout_json.
Use fileType for sub-formats: "xlsx"/"csv" (bom, pick_and_place), "step"/"obj" (3d).`,
		{
			format: z
				.enum([
					'dsn', 'autoroute_json', 'autolayout_json', 'gerber', 'bom',
					'pick_and_place', '3d', 'pdf', 'netlist', 'dxf', 'altium', 'pads',
				])
				.describe('Export format'),
			fileName: z.string().optional().describe('Output file name'),
			fileType: z
				.string()
				.optional()
				.describe('Sub-format (e.g. "xlsx"/"csv" for bom, "step"/"obj" for 3d)'),
		},
		async ({ format, fileName, fileType }) => {
			const result = await bridge.send(EXPORT_HANDLER_MAP[format], { fileName, fileType });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_import',
		`Import routing or layout result files into the PCB (Base64-encoded).
Formats: autoroute_json (JSON autoroute), autolayout_json (JSON autolayout), autoroute_ses (FreeRouting SES).`,
		{
			format: z
				.enum(['autoroute_json', 'autolayout_json', 'autoroute_ses'])
				.describe('Import format'),
			data: z.string().describe('Base64-encoded file content'),
			fileName: z.string().optional().describe('File name'),
		},
		async ({ format, data, fileName }) => {
			const result = await bridge.send(IMPORT_HANDLER_MAP[format], { data, fileName });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);
}
