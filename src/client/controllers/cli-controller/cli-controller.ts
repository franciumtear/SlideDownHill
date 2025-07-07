import { Centurion } from "@rbxts/centurion";
import { CenturionUI } from "@rbxts/centurion-ui";
import { ScriptContext } from "@rbxts/services";
import { $error, $print } from "rbxts-transform-debug";

export namespace CliController {
	let isStarted = false;

	export const start = () => {
		if (isStarted) {
			$error("CliController.start() has already been called");
		}

		isStarted = true;

		$print("Starting CliController");

		task.defer(() => {
			const client = Centurion.client();

			const commandContainer = script.Parent?.FindFirstChild("commands");
			assert(commandContainer !== undefined);
			client.registry.load(commandContainer);

			client
				.start()
				.then(() => CenturionUI.start(client, {}))
				.catch((err) => warn("Failed to start Centurion:", err));
		});
	};
}
