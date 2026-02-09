export const pcbPrimitiveHandlers: Record<string, (params: Record<string, any>) => Promise<any>> = {
	// === Arc ===

	'pcb.getAll.arc': async (params) => {
		return eda.pcb_PrimitiveArc.getAll(params.net, params.layer);
	},

	'pcb.get.arc': async (params) => {
		return eda.pcb_PrimitiveArc.get(params.primitiveIds);
	},

	'pcb.create.arc': async (params) => {
		return eda.pcb_PrimitiveArc.create(
			params.net,
			params.layer,
			params.startX,
			params.startY,
			params.endX,
			params.endY,
			params.arcAngle,
			params.lineWidth,
			params.interactiveMode,
			params.primitiveLock,
		);
	},

	'pcb.modify.arc': async (params) => {
		return eda.pcb_PrimitiveArc.modify(params.primitiveId, params.property);
	},

	'pcb.delete.arc': async (params) => {
		return eda.pcb_PrimitiveArc.delete(params.ids);
	},

	// === Region ===

	'pcb.getAll.region': async (params) => {
		return eda.pcb_PrimitiveRegion.getAll(params.layer, params.ruleType);
	},

	'pcb.get.region': async (params) => {
		return eda.pcb_PrimitiveRegion.get(params.primitiveIds);
	},

	'pcb.create.region': async (params) => {
		const polygon = eda.pcb_MathPolygon.createPolygon(params.polygon);
		if (!polygon) {
			throw new Error('Invalid polygon data');
		}
		return eda.pcb_PrimitiveRegion.create(
			params.layer,
			polygon,
			params.ruleType,
			params.regionName,
			params.lineWidth,
			params.primitiveLock,
		);
	},

	'pcb.modify.region': async (params) => {
		return eda.pcb_PrimitiveRegion.modify(params.primitiveId, params.property);
	},

	'pcb.delete.region': async (params) => {
		return eda.pcb_PrimitiveRegion.delete(params.ids);
	},
};
