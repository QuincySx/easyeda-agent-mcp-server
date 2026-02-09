async function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const dataUrl = reader.result as string;
			resolve(dataUrl.split(',')[1] || '');
		};
		reader.onerror = () => reject(new Error('Failed to read file'));
		reader.readAsDataURL(file);
	});
}

function base64ToFile(base64: string, fileName: string, mimeType = 'application/octet-stream'): File {
	const binaryStr = atob(base64);
	const bytes = new Uint8Array(binaryStr.length);
	for (let i = 0; i < binaryStr.length; i++) {
		bytes[i] = binaryStr.charCodeAt(i);
	}
	return new File([bytes], fileName, { type: mimeType });
}

async function exportFile(file: File | undefined): Promise<{ fileName: string; data: string; size: number }> {
	if (!file) throw new Error('Failed to export file');
	const data = await fileToBase64(file);
	return { fileName: file.name, data, size: file.size };
}

export const manufactureHandlers: Record<string, (params: Record<string, any>) => Promise<any>> = {
	// === Export ===

	'pcb.manufacture.getDsnFile': async (params) => {
		const file = await eda.pcb_ManufactureData.getDsnFile(params.fileName);
		return exportFile(file);
	},

	'pcb.manufacture.getAutoRouteJsonFile': async (params) => {
		const file = await eda.pcb_ManufactureData.getAutoRouteJsonFile(params.fileName);
		return exportFile(file);
	},

	'pcb.manufacture.getAutoLayoutJsonFile': async (params) => {
		const file = await eda.pcb_ManufactureData.getAutoLayoutJsonFile(params.fileName);
		return exportFile(file);
	},

	'pcb.manufacture.getGerberFile': async (params) => {
		const file = await eda.pcb_ManufactureData.getGerberFile(
			params.fileName,
			params.colorSilkscreen,
			params.unit,
			params.digitalFormat,
			params.other,
			params.layers,
			params.objects,
		);
		return exportFile(file);
	},

	'pcb.manufacture.getBomFile': async (params) => {
		const file = await eda.pcb_ManufactureData.getBomFile(
			params.fileName,
			params.fileType,
			params.template,
			params.filterOptions,
			params.statistics,
			params.property,
			params.columns,
		);
		return exportFile(file);
	},

	'pcb.manufacture.getPickAndPlaceFile': async (params) => {
		const file = await eda.pcb_ManufactureData.getPickAndPlaceFile(
			params.fileName,
			params.fileType,
			params.unit,
		);
		return exportFile(file);
	},

	'pcb.manufacture.get3DFile': async (params) => {
		const file = await eda.pcb_ManufactureData.get3DFile(
			params.fileName,
			params.fileType,
			params.element,
			params.modelMode,
			params.autoGenerateModels,
		);
		return exportFile(file);
	},

	'pcb.manufacture.getPdfFile': async (params) => {
		const file = await eda.pcb_ManufactureData.getPdfFile(params.fileName);
		return exportFile(file);
	},

	'pcb.manufacture.getNetlistFile': async (params) => {
		const file = await eda.pcb_ManufactureData.getNetlistFile(params.fileName, params.netlistType);
		return exportFile(file);
	},

	'pcb.manufacture.getDxfFile': async (params) => {
		const file = await eda.pcb_ManufactureData.getDxfFile(params.fileName, params.layers, params.objects);
		return exportFile(file);
	},

	'pcb.manufacture.getAltiumDesignerFile': async (params) => {
		const file = await eda.pcb_ManufactureData.getAltiumDesignerFile(params.fileName);
		return exportFile(file);
	},

	'pcb.manufacture.getPadsFile': async (params) => {
		const file = await eda.pcb_ManufactureData.getPadsFile(params.fileName);
		return exportFile(file);
	},

	// === Import ===

	'pcb.manufacture.importAutoRouteJson': async (params) => {
		const file = base64ToFile(params.data, params.fileName || 'autoroute.json');
		return eda.pcb_Document.importAutoRouteJsonFile(file);
	},

	'pcb.manufacture.importAutoLayoutJson': async (params) => {
		const file = base64ToFile(params.data, params.fileName || 'autolayout.json');
		return eda.pcb_Document.importAutoLayoutJsonFile(file);
	},

	// importAutoRouteSesFile exists at runtime (used by freerouting extension) but not in type definitions
	'pcb.manufacture.importAutoRouteSes': async (params) => {
		const file = base64ToFile(params.data, params.fileName || 'autoroute.ses');
		const doc = eda.pcb_Document as any;
		if (typeof doc.importAutoRouteSesFile !== 'function') {
			throw new Error('importAutoRouteSesFile API is not available in this version');
		}
		return doc.importAutoRouteSesFile(file);
	},
};
