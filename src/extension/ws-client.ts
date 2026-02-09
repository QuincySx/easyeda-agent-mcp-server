import { componentHandlers } from './handlers/component';
import { trackHandlers } from './handlers/track';
import { viaHandlers } from './handlers/via';
import { netHandlers } from './handlers/net';
import { drcHandlers } from './handlers/drc';
import { documentHandlers } from './handlers/document';
import { schComponentHandlers } from './handlers/sch-component';
import { schWireHandlers } from './handlers/sch-wire';
import { schDocumentHandlers } from './handlers/sch-document';
import { schSelectHandlers } from './handlers/sch-select';
import { schPrimitiveHandlers } from './handlers/sch-primitive';
import { libraryHandlers } from './handlers/library';
import { pourFillHandlers } from './handlers/pour-fill';
import { manufactureHandlers } from './handlers/manufacture';
import { layerHandlers } from './handlers/layer';
import { pcbPrimitiveHandlers } from './handlers/pcb-primitive';

const WS_ID = 'mcp-bridge';
const WS_URL = 'ws://localhost:15168';

const allHandlers: Record<string, (params: Record<string, any>) => Promise<any>> = {
	...componentHandlers,
	...trackHandlers,
	...viaHandlers,
	...netHandlers,
	...drcHandlers,
	...documentHandlers,
	...schComponentHandlers,
	...schWireHandlers,
	...schDocumentHandlers,
	...schSelectHandlers,
	...schPrimitiveHandlers,
	...libraryHandlers,
	...pourFillHandlers,
	...manufactureHandlers,
	...layerHandlers,
	...pcbPrimitiveHandlers,
};

export function connectToMcpServer(extensionUuid: string): void {
	eda.sys_WebSocket.register(
		WS_ID,
		WS_URL,
		async (event: MessageEvent<any>) => {
			let id: string | undefined;
			try {
				const message = typeof event.data === 'string' ? event.data : String(event.data);
				const request = JSON.parse(message);
				id = request.id;
				const method: string = request.method;
				const params: Record<string, any> = request.params || {};

				const handler = allHandlers[method];
				if (!handler) {
					sendResponse(extensionUuid, id!, undefined, `Unknown method: ${method}`);
					return;
				}

				const result = await handler(params);
				sendResponse(extensionUuid, id!, result);
			} catch (err: any) {
				const errorMsg = err instanceof Error ? err.message : String(err);
				if (id) {
					sendResponse(extensionUuid, id, undefined, errorMsg);
				}
			}
		},
		() => {
			eda.sys_Message.showMessage('Connected to Claude MCP Server');
		},
		extensionUuid,
	);
}

function sendResponse(extensionUuid: string, id: string, result?: any, error?: string): void {
	const response: Record<string, any> = { id };
	if (error) {
		response.error = error;
	} else {
		response.result = result;
	}
	eda.sys_WebSocket.send(WS_ID, JSON.stringify(response), extensionUuid);
}

export function disconnectFromMcpServer(extensionUuid: string): void {
	try {
		eda.sys_WebSocket.close(WS_ID, undefined, undefined, extensionUuid);
	} catch {
		// Ignore close errors
	}
}
