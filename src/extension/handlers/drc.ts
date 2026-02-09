export const drcHandlers: Record<string, (params: Record<string, any>) => Promise<any>> = {
	// === DRC Check ===

	'pcb.drc.check': async (params) => {
		return eda.pcb_Drc.check(params.strict, params.ui, params.verbose);
	},

	// === Rule Configuration ===

	'pcb.drc.getCurrentRuleConfigName': async () => {
		return eda.pcb_Drc.getCurrentRuleConfigurationName();
	},

	'pcb.drc.getRuleConfiguration': async () => {
		return eda.pcb_Drc.getCurrentRuleConfiguration();
	},

	'pcb.drc.getRuleConfigByName': async (params) => {
		return eda.pcb_Drc.getRuleConfiguration(params.configurationName);
	},

	'pcb.drc.getAllRuleConfigs': async (params) => {
		return eda.pcb_Drc.getAllRuleConfigurations(params.includeSystem);
	},

	'pcb.drc.saveRuleConfig': async (params) => {
		return eda.pcb_Drc.saveRuleConfiguration(
			params.ruleConfiguration,
			params.configurationName,
			params.allowOverwrite,
		);
	},

	'pcb.drc.renameRuleConfig': async (params) => {
		return eda.pcb_Drc.renameRuleConfiguration(params.originalName, params.newName);
	},

	'pcb.drc.deleteRuleConfig': async (params) => {
		return eda.pcb_Drc.deleteRuleConfiguration(params.configurationName);
	},

	'pcb.drc.getDefaultRuleConfigName': async () => {
		return eda.pcb_Drc.getDefaultRuleConfigurationName();
	},

	'pcb.drc.setAsDefaultRuleConfig': async (params) => {
		return eda.pcb_Drc.setAsDefaultRuleConfiguration(params.configurationName);
	},

	// === Net Rules ===

	'pcb.drc.getNetRules': async () => {
		return eda.pcb_Drc.getNetRules();
	},

	'pcb.drc.overwriteNetRules': async (params) => {
		return eda.pcb_Drc.overwriteNetRules(params.netRules);
	},

	'pcb.drc.getNetByNetRules': async () => {
		return eda.pcb_Drc.getNetByNetRules();
	},

	'pcb.drc.overwriteNetByNetRules': async (params) => {
		return eda.pcb_Drc.overwriteNetByNetRules(params.netByNetRules);
	},

	'pcb.drc.getRegionRules': async () => {
		return eda.pcb_Drc.getRegionRules();
	},

	'pcb.drc.overwriteRegionRules': async (params) => {
		return eda.pcb_Drc.overwriteRegionRules(params.regionRules);
	},

	// === Net Class ===

	'pcb.drc.getAllNetClasses': async () => {
		return eda.pcb_Drc.getAllNetClasses();
	},

	'pcb.drc.createNetClass': async (params) => {
		return eda.pcb_Drc.createNetClass(params.netClassName, params.nets, params.color);
	},

	'pcb.drc.deleteNetClass': async (params) => {
		return eda.pcb_Drc.deleteNetClass(params.netClassName);
	},

	'pcb.drc.modifyNetClassName': async (params) => {
		return eda.pcb_Drc.modifyNetClassName(params.originalName, params.newName);
	},

	'pcb.drc.addNetToNetClass': async (params) => {
		return eda.pcb_Drc.addNetToNetClass(params.netClassName, params.net);
	},

	'pcb.drc.removeNetFromNetClass': async (params) => {
		return eda.pcb_Drc.removeNetFromNetClass(params.netClassName, params.net);
	},

	// === Differential Pair ===

	'pcb.drc.getDiffPairs': async () => {
		return eda.pcb_Drc.getAllDifferentialPairs();
	},

	'pcb.drc.createDiffPair': async (params) => {
		return eda.pcb_Drc.createDifferentialPair(params.name, params.positiveNet, params.negativeNet);
	},

	'pcb.drc.deleteDiffPair': async (params) => {
		return eda.pcb_Drc.deleteDifferentialPair(params.name);
	},

	'pcb.drc.modifyDiffPairName': async (params) => {
		return eda.pcb_Drc.modifyDifferentialPairName(params.originalName, params.newName);
	},

	'pcb.drc.modifyDiffPairPositiveNet': async (params) => {
		return eda.pcb_Drc.modifyDifferentialPairPositiveNet(params.name, params.positiveNet);
	},

	'pcb.drc.modifyDiffPairNegativeNet': async (params) => {
		return eda.pcb_Drc.modifyDifferentialPairNegativeNet(params.name, params.negativeNet);
	},

	// === Equal Length Net Group ===

	'pcb.drc.getEqualLengthGroups': async () => {
		return eda.pcb_Drc.getAllEqualLengthNetGroups();
	},

	'pcb.drc.createEqualLengthGroup': async (params) => {
		return eda.pcb_Drc.createEqualLengthNetGroup(params.name, params.nets, params.color);
	},

	'pcb.drc.deleteEqualLengthGroup': async (params) => {
		return eda.pcb_Drc.deleteEqualLengthNetGroup(params.name);
	},

	'pcb.drc.modifyEqualLengthGroupName': async (params) => {
		return eda.pcb_Drc.modifyEqualLengthNetGroupName(params.originalName, params.newName);
	},

	'pcb.drc.addNetToEqualLengthGroup': async (params) => {
		return eda.pcb_Drc.addNetToEqualLengthNetGroup(params.name, params.net);
	},

	'pcb.drc.removeNetFromEqualLengthGroup': async (params) => {
		return eda.pcb_Drc.removeNetFromEqualLengthNetGroup(params.name, params.net);
	},

	// === Pad Pair Group ===

	'pcb.drc.createPadPairGroup': async (params) => {
		return eda.pcb_Drc.createPadPairGroup(params.name, params.padPairs);
	},

	'pcb.drc.deletePadPairGroup': async (params) => {
		return eda.pcb_Drc.deletePadPairGroup(params.name);
	},

	'pcb.drc.modifyPadPairGroupName': async (params) => {
		return eda.pcb_Drc.modifyPadPairGroupName(params.originalName, params.newName);
	},
};
