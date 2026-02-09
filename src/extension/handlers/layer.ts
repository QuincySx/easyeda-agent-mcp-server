export const layerHandlers: Record<string, (params: Record<string, any>) => Promise<any>> = {
	'pcb.layer.getAll': async () => {
		return eda.pcb_Layer.getAllLayers();
	},

	'pcb.layer.select': async (params) => {
		return eda.pcb_Layer.selectLayer(params.layer);
	},

	'pcb.layer.setVisible': async (params) => {
		return eda.pcb_Layer.setLayerVisible(params.layer, params.setOtherLayerInvisible);
	},

	'pcb.layer.setInvisible': async (params) => {
		return eda.pcb_Layer.setLayerInvisible(params.layer, params.setOtherLayerVisible);
	},

	'pcb.layer.lock': async (params) => {
		return eda.pcb_Layer.lockLayer(params.layer);
	},

	'pcb.layer.unlock': async (params) => {
		return eda.pcb_Layer.unlockLayer(params.layer);
	},

	'pcb.layer.setCopperCount': async (params) => {
		return eda.pcb_Layer.setTheNumberOfCopperLayers(params.count);
	},

	'pcb.layer.modify': async (params) => {
		return eda.pcb_Layer.modifyLayer(params.layer, params.property);
	},

	'pcb.layer.addCustom': async () => {
		return eda.pcb_Layer.addCustomLayer();
	},

	'pcb.layer.remove': async (params) => {
		return eda.pcb_Layer.removeLayer(params.layer);
	},
};
