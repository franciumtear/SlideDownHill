import { $assert, $print } from "rbxts-transform-debug";
import { getVehicleData, Vehicle } from "shared/modules/vehicle-spawn";
import { remotes } from "../../shared/modules/remotes/remotes";
import { Workspace } from "@rbxts/services";
import { isPlaceable } from "shared/modules/placement";
import { observeCharacter } from "@rbxts/observers";

export namespace SpawnService {
	let isStarted = false;

	export const start = () => {
		$assert(!isStarted, "SpawnService.start() has already been called");

		isStarted = true;

		$print("SpawnService started");
	};

	const spawned = new Map<Player, Instance>();

	const removeOld = (player: Player) => {
		const oldVehicle = spawned.get(player);
		if (oldVehicle) {
			oldVehicle.Destroy();
			spawned.delete(player);
		}
	};

	remotes.spawn.connect((player: Player, vehicle: Vehicle, position: Vector3) => {
		if (isPlaceable(position, vehicle)) {
			const vehicleData = getVehicleData(vehicle);
			const model = vehicleData.model.Clone();
			model.Parent = Workspace;
			model.MoveTo(position);

			removeOld(player);
			spawned.set(player, model);
		}
	});

	observeCharacter((player, _) => {
		return () => removeOld(player);
	});
}
