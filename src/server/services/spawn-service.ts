import { $assert, $print } from "rbxts-transform-debug";
import { getVehicleData, Vehicle } from "shared/modules/vehicle-spawn";
import { remotes } from "../../shared/modules/remotes/remotes";
import { Players, Workspace } from "@rbxts/services";
import { isPlaceable } from "shared/modules/placement";
import { effect } from "@rbxts/charm";

export namespace SpawnService {
	let isStarted = false;

	export const start = () => {
		$assert(!isStarted, "SpawnService.start() has already been called");

		isStarted = true;

		$print("SpawnService started");
	};

	const spawned: Record<string, Instance> = {};

	remotes.spawn.connect((player: Player, vehicle: Vehicle, position: Vector3) => {
		if (isPlaceable(position, vehicle)) {
			const vehicleData = getVehicleData(vehicle);
			const model = vehicleData.model.Clone();
			model.Parent = Workspace;
			model.MoveTo(position);

			if (player.Name in spawned) {
				const oldVehicle = spawned[player.Name];
				oldVehicle.Destroy();
				spawned[player.Name] = model;
				$print(spawned);
			} else {
				spawned[player.Name] = model;
				$print(spawned);
			}
		}
	});

	Players.PlayerRemoving.Connect((player) => {
		player.CharacterRemoving.Connect((_) => {
			if (player.Name in spawned) {
				const oldVehicle = spawned[player.Name];
				oldVehicle.Destroy();
				delete spawned[player.Name];
				$print(spawned);
			}
		});
	});
}
