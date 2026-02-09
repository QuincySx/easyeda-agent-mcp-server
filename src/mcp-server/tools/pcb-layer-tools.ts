import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { WebSocketBridge } from '../bridge';

const LAYER_HANDLERS: Record<string, string> = {
	get_all: 'pcb.layer.getAll',
	select: 'pcb.layer.select',
	set_visible: 'pcb.layer.setVisible',
	set_invisible: 'pcb.layer.setInvisible',
	lock: 'pcb.layer.lock',
	unlock: 'pcb.layer.unlock',
	set_copper_count: 'pcb.layer.setCopperCount',
	modify: 'pcb.layer.modify',
	add_custom: 'pcb.layer.addCustom',
	remove: 'pcb.layer.remove',
};

export function registerPcbLayerTools(server: McpServer, bridge: WebSocketBridge): void {
	server.tool(
		'pcb_manage_layers',
		`Manage PCB layers. Actions:
- get_all: get all layers with properties
- select: set active layer (layer: string)
- set_visible: show layer(s) (layer optional; setOtherLayerInvisible optional for solo mode)
- set_invisible: hide layer(s) (layer optional; setOtherLayerVisible optional)
- lock: lock layer(s) (layer optional)
- unlock: unlock layer(s) (layer optional)
- set_copper_count: set copper layers (count: 2,4,6,...,32)
- modify: modify layer properties (layer: string, property: {name?, type?, color?, transparency?})
- add_custom: add a new custom layer
- remove: remove a custom layer (layer: string)`,
		{
			action: z
				.enum([
					'get_all', 'select', 'set_visible', 'set_invisible',
					'lock', 'unlock', 'set_copper_count', 'modify', 'add_custom', 'remove',
				])
				.describe('Action to perform'),
			layer: z
				.union([z.string(), z.array(z.string())])
				.optional()
				.describe('Layer name(s)'),
			setOtherLayerInvisible: z
				.boolean()
				.optional()
				.describe('Hide all other layers (for set_visible)'),
			setOtherLayerVisible: z
				.boolean()
				.optional()
				.describe('Show all other layers (for set_invisible)'),
			count: z.number().optional().describe('Copper layer count (for set_copper_count)'),
			property: z
				.object({
					name: z.string().optional(),
					type: z.string().optional(),
					color: z.string().optional(),
					transparency: z.number().optional(),
				})
				.optional()
				.describe('Properties to modify (for modify action)'),
		},
		async ({ action, ...params }) => {
			const result = await bridge.send(LAYER_HANDLERS[action], params);
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);
}
