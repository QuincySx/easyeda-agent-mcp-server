export const documentHandlers: Record<string, (params: Record<string, any>) => Promise<any>> = {
	// === Document ===

	'pcb.document.save': async (params) => {
		return eda.pcb_Document.save(params.uuid);
	},

	'pcb.document.navigateTo': async (params) => {
		return eda.pcb_Document.navigateToCoordinates(params.x, params.y);
	},

	'pcb.document.navigateToRegion': async (params) => {
		return eda.pcb_Document.navigateToRegion(params.left, params.right, params.top, params.bottom);
	},

	'pcb.document.getPrimitiveAtPoint': async (params) => {
		return eda.pcb_Document.getPrimitiveAtPoint(params.x, params.y);
	},

	'pcb.document.getPrimitivesInRegion': async (params) => {
		return eda.pcb_Document.getPrimitivesInRegion(
			params.left,
			params.right,
			params.top,
			params.bottom,
			params.leftToRight,
		);
	},

	'pcb.document.zoomToBoardOutline': async () => {
		return eda.pcb_Document.zoomToBoardOutline();
	},

	'pcb.document.getCanvasOrigin': async () => {
		return eda.pcb_Document.getCanvasOrigin();
	},

	'pcb.document.setCanvasOrigin': async (params) => {
		return eda.pcb_Document.setCanvasOrigin(params.offsetX, params.offsetY);
	},

	'pcb.document.convertCanvasToData': async (params) => {
		return eda.pcb_Document.convertCanvasOriginToDataOrigin(params.x, params.y);
	},

	'pcb.document.convertDataToCanvas': async (params) => {
		return eda.pcb_Document.convertDataOriginToCanvasOrigin(params.x, params.y);
	},

	'pcb.document.importChanges': async (params) => {
		return eda.pcb_Document.importChanges(params.uuid);
	},

	// === Selection ===

	'pcb.select.getAll': async () => {
		return eda.pcb_SelectControl.getAllSelectedPrimitives();
	},

	// === Pad ===

	'pcb.getAll.pad': async (params) => {
		return eda.pcb_PrimitivePad.getAll(params.layer, params.net);
	},

	'pcb.get.pad': async (params) => {
		return eda.pcb_PrimitivePad.get(params.primitiveIds);
	},

	'pcb.create.pad': async (params) => {
		return eda.pcb_PrimitivePad.create(
			params.layer,
			params.padNumber,
			params.x,
			params.y,
			params.rotation,
			params.pad,
			params.net,
			params.hole,
			params.holeOffsetX,
			params.holeOffsetY,
			params.holeRotation,
			params.metallization,
			params.padType,
			params.specialPad,
			params.solderMaskAndPasteMaskExpansion,
			params.heatWelding,
			params.primitiveLock,
		);
	},

	'pcb.modify.pad': async (params) => {
		return eda.pcb_PrimitivePad.modify(params.primitiveId, params.property);
	},

	'pcb.delete.pad': async (params) => {
		return eda.pcb_PrimitivePad.delete(params.ids);
	},
};
