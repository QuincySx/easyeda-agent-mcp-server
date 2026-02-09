export const componentHandlers: Record<string, (params: Record<string, any>) => Promise<any>> = {
	'pcb.getAll.component': async (params) => {
		return eda.pcb_PrimitiveComponent.getAll(params.layer);
	},

	'pcb.get.component': async (params) => {
		return eda.pcb_PrimitiveComponent.get(params.primitiveIds);
	},

	'pcb.modify.component': async (params) => {
		return eda.pcb_PrimitiveComponent.modify(params.primitiveId, params.property);
	},

	'pcb.delete.component': async (params) => {
		return eda.pcb_PrimitiveComponent.delete(params.ids);
	},

	'pcb.component.getPins': async (params) => {
		return eda.pcb_PrimitiveComponent.getAllPinsByPrimitiveId(params.primitiveId);
	},
};
