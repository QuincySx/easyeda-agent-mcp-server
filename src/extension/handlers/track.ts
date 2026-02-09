export const trackHandlers: Record<string, (params: Record<string, any>) => Promise<any>> = {
	// Line
	'pcb.getAll.line': async (params) => {
		return eda.pcb_PrimitiveLine.getAll(params.net, params.layer);
	},

	'pcb.get.line': async (params) => {
		return eda.pcb_PrimitiveLine.get(params.primitiveIds);
	},

	'pcb.create.line': async (params) => {
		return eda.pcb_PrimitiveLine.create(
			params.net,
			params.layer,
			params.startX,
			params.startY,
			params.endX,
			params.endY,
			params.lineWidth,
		);
	},

	'pcb.modify.line': async (params) => {
		return eda.pcb_PrimitiveLine.modify(params.primitiveId, params.property);
	},

	'pcb.delete.line': async (params) => {
		return eda.pcb_PrimitiveLine.delete(params.ids);
	},

	// Polyline
	'pcb.getAll.polyline': async (params) => {
		return eda.pcb_PrimitivePolyline.getAll(params.net, params.layer);
	},

	'pcb.get.polyline': async (params) => {
		return eda.pcb_PrimitivePolyline.get(params.primitiveIds);
	},

	'pcb.create.polyline': async (params) => {
		return eda.pcb_PrimitivePolyline.create(params.net, params.layer, params.polygon, params.lineWidth);
	},

	'pcb.modify.polyline': async (params) => {
		return eda.pcb_PrimitivePolyline.modify(params.primitiveId, params.property);
	},

	'pcb.delete.polyline': async (params) => {
		return eda.pcb_PrimitivePolyline.delete(params.ids);
	},
};
