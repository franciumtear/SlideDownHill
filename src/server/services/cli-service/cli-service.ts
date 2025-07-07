import { Centurion } from "@rbxts/centurion";
import { ServerScriptService } from "@rbxts/services";
import { $error, $print } from "rbxts-transform-debug";

export namespace CliService {
	let isStarted = false;

	export const start = () => {
		if (isStarted) {
			$error("CliService.start() has already been called");
		}

		isStarted = true;

		$print("Starting CliService");

		const server = Centurion.server();

		// Load all child ModuleScripts under each container
		const commandContainer = ServerScriptService.TS.services["cli-service"].commands;
		server.registry.load(commandContainer);

		// const typeContainer = ReplicatedStorage.types;
		// server.registry.load(typeContainer);

		// Any loaded commands and types will then be registered once Centurion is started
		server.start();
	};
}
