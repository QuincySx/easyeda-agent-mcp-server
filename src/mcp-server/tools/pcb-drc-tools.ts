import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { WebSocketBridge } from '../bridge';

const RULE_CONFIG_HANDLERS: Record<string, string> = {
	get_current_name: 'pcb.drc.getCurrentRuleConfigName',
	get_by_name: 'pcb.drc.getRuleConfigByName',
	get_all: 'pcb.drc.getAllRuleConfigs',
	save: 'pcb.drc.saveRuleConfig',
	rename: 'pcb.drc.renameRuleConfig',
	delete: 'pcb.drc.deleteRuleConfig',
	get_default_name: 'pcb.drc.getDefaultRuleConfigName',
	set_default: 'pcb.drc.setAsDefaultRuleConfig',
};

const NET_RULES_HANDLERS: Record<string, string> = {
	overwrite_net: 'pcb.drc.overwriteNetRules',
	get_net_by_net: 'pcb.drc.getNetByNetRules',
	overwrite_net_by_net: 'pcb.drc.overwriteNetByNetRules',
	get_region: 'pcb.drc.getRegionRules',
	overwrite_region: 'pcb.drc.overwriteRegionRules',
};

const NET_CLASS_HANDLERS: Record<string, string> = {
	get_all: 'pcb.drc.getAllNetClasses',
	create: 'pcb.drc.createNetClass',
	delete: 'pcb.drc.deleteNetClass',
	rename: 'pcb.drc.modifyNetClassName',
	add_net: 'pcb.drc.addNetToNetClass',
	remove_net: 'pcb.drc.removeNetFromNetClass',
};

const DIFF_PAIR_HANDLERS: Record<string, string> = {
	get_all: 'pcb.drc.getDiffPairs',
	create: 'pcb.drc.createDiffPair',
	delete: 'pcb.drc.deleteDiffPair',
	rename: 'pcb.drc.modifyDiffPairName',
};

const EQUAL_LENGTH_HANDLERS: Record<string, string> = {
	get_all: 'pcb.drc.getEqualLengthGroups',
	create: 'pcb.drc.createEqualLengthGroup',
	delete: 'pcb.drc.deleteEqualLengthGroup',
	rename: 'pcb.drc.modifyEqualLengthGroupName',
	add_net: 'pcb.drc.addNetToEqualLengthGroup',
	remove_net: 'pcb.drc.removeNetFromEqualLengthGroup',
};

const PAD_PAIR_HANDLERS: Record<string, string> = {
	create: 'pcb.drc.createPadPairGroup',
	delete: 'pcb.drc.deletePadPairGroup',
	rename: 'pcb.drc.modifyPadPairGroupName',
};

export function registerPcbDrcTools(server: McpServer, bridge: WebSocketBridge): void {
	server.tool(
		'pcb_manage_rule_config',
		`Manage DRC rule configurations. Actions:
- get_current_name: get current active config name
- get_by_name: get config by name (configurationName)
- get_all: get all configs (includeSystem optional)
- save: save config (ruleConfiguration, configurationName; allowOverwrite optional)
- rename: rename config (originalName, newName)
- delete: delete config (configurationName)
- get_default_name: get default config name
- set_default: set as default (configurationName)`,
		{
			action: z
				.enum([
					'get_current_name', 'get_by_name', 'get_all', 'save',
					'rename', 'delete', 'get_default_name', 'set_default',
				])
				.describe('Action to perform'),
			configurationName: z.string().optional().describe('Config name'),
			ruleConfiguration: z.record(z.any()).optional().describe('Rule config object (for save)'),
			allowOverwrite: z.boolean().optional().describe('Allow overwrite (for save)'),
			includeSystem: z.boolean().optional().describe('Include system configs (for get_all)'),
			originalName: z.string().optional().describe('Current name (for rename)'),
			newName: z.string().optional().describe('New name (for rename)'),
		},
		async ({ action, ...params }) => {
			const result = await bridge.send(RULE_CONFIG_HANDLERS[action], params);
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_manage_net_rules',
		`Manage net-specific design rules. Actions:
- overwrite_net: overwrite net rules (netRules: array of net rule objects)
- get_net_by_net: get net-by-net clearance rules
- overwrite_net_by_net: overwrite net-by-net rules (netByNetRules: object)
- get_region: get region-specific rules
- overwrite_region: overwrite region rules (regionRules: array of region rule objects)`,
		{
			action: z
				.enum(['overwrite_net', 'get_net_by_net', 'overwrite_net_by_net', 'get_region', 'overwrite_region'])
				.describe('Action to perform'),
			netRules: z.array(z.record(z.any())).optional().describe('Net rules array (for overwrite_net)'),
			netByNetRules: z.record(z.any()).optional().describe('Net-by-net rules (for overwrite_net_by_net)'),
			regionRules: z.array(z.record(z.any())).optional().describe('Region rules array (for overwrite_region)'),
		},
		async ({ action, ...params }) => {
			const result = await bridge.send(NET_RULES_HANDLERS[action], params);
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_manage_net_classes',
		`Manage net classes. Actions:
- get_all: get all net class definitions
- create: create net class (netClassName, nets: string[]; color optional)
- delete: delete net class (netClassName)
- rename: rename net class (originalName, newName)
- add_net: add net(s) to class (netClassName, net: string|string[])
- remove_net: remove net(s) from class (netClassName, net: string|string[])`,
		{
			action: z
				.enum(['get_all', 'create', 'delete', 'rename', 'add_net', 'remove_net'])
				.describe('Action to perform'),
			netClassName: z.string().optional().describe('Net class name'),
			nets: z.array(z.string()).optional().describe('Net names array (for create)'),
			net: z.union([z.string(), z.array(z.string())]).optional().describe('Net name(s) (for add_net, remove_net)'),
			color: z.record(z.any()).optional().describe('Color config (for create)'),
			originalName: z.string().optional().describe('Current name (for rename)'),
			newName: z.string().optional().describe('New name (for rename)'),
		},
		async ({ action, ...params }) => {
			const result = await bridge.send(NET_CLASS_HANDLERS[action], params);
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_manage_diff_pairs',
		`Manage differential pair definitions. Actions:
- get_all: get all differential pairs
- create: create diff pair (name, positiveNet, negativeNet)
- delete: delete diff pair (name)
- rename: rename diff pair (originalName, newName)
- modify_nets: modify positive/negative net (name, positiveNet and/or negativeNet)`,
		{
			action: z
				.enum(['get_all', 'create', 'delete', 'rename', 'modify_nets'])
				.describe('Action to perform'),
			name: z.string().optional().describe('Differential pair name'),
			positiveNet: z.string().optional().describe('Positive signal net'),
			negativeNet: z.string().optional().describe('Negative signal net'),
			originalName: z.string().optional().describe('Current name (for rename)'),
			newName: z.string().optional().describe('New name (for rename)'),
		},
		async ({ action, name, positiveNet, negativeNet, originalName, newName }) => {
			if (action === 'modify_nets') {
				const results: Record<string, unknown> = {};
				if (positiveNet !== undefined) {
					results.positive = await bridge.send('pcb.drc.modifyDiffPairPositiveNet', { name, positiveNet });
				}
				if (negativeNet !== undefined) {
					results.negative = await bridge.send('pcb.drc.modifyDiffPairNegativeNet', { name, negativeNet });
				}
				return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
			}
			const result = await bridge.send(DIFF_PAIR_HANDLERS[action], { name, positiveNet, negativeNet, originalName, newName });
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_manage_equal_length_groups',
		`Manage equal-length net groups. Actions:
- get_all: get all equal-length groups
- create: create group (name, nets: string[]; color optional)
- delete: delete group (name)
- rename: rename group (originalName, newName)
- add_net: add net(s) to group (name, net: string|string[])
- remove_net: remove net(s) from group (name, net: string|string[])`,
		{
			action: z
				.enum(['get_all', 'create', 'delete', 'rename', 'add_net', 'remove_net'])
				.describe('Action to perform'),
			name: z.string().optional().describe('Group name'),
			nets: z.array(z.string()).optional().describe('Net names array (for create)'),
			net: z.union([z.string(), z.array(z.string())]).optional().describe('Net name(s) (for add_net, remove_net)'),
			color: z.record(z.any()).optional().describe('Color config (for create)'),
			originalName: z.string().optional().describe('Current name (for rename)'),
			newName: z.string().optional().describe('New name (for rename)'),
		},
		async ({ action, ...params }) => {
			const result = await bridge.send(EQUAL_LENGTH_HANDLERS[action], params);
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	server.tool(
		'pcb_manage_pad_pair_groups',
		`Manage pad pair groups for length-matching. Actions:
- create: create group (name, padPairs: [[padId1, padId2], ...])
- delete: delete group (name)
- rename: rename group (originalName, newName)`,
		{
			action: z
				.enum(['create', 'delete', 'rename'])
				.describe('Action to perform'),
			name: z.string().optional().describe('Pad pair group name'),
			padPairs: z
				.array(z.tuple([z.string(), z.string()]))
				.optional()
				.describe('Pad pair tuples (for create)'),
			originalName: z.string().optional().describe('Current name (for rename)'),
			newName: z.string().optional().describe('New name (for rename)'),
		},
		async ({ action, ...params }) => {
			const result = await bridge.send(PAD_PAIR_HANDLERS[action], params);
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);
}
