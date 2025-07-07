import { $assert, $print } from "rbxts-transform-debug";
import { getVehicleData, Vehicle } from "shared/modules/vehicle-spawn";
import { remotes } from "../../shared/modules/remotes/remotes";
import { Workspace } from "@rbxts/services";

export namespace SpawnService {
	let isStarted = false;

	export const start = () => {
		$assert(!isStarted, "SpawnService.start() has already been called");

		isStarted = true;

		$print("SpawnService started");
	};

	remotes.spawn.connect((player: Player, vehicle: Vehicle, position: Vector3) => {
		const vehicleData = getVehicleData(vehicle);
		const model = vehicleData.model;
		model.Parent = Workspace;
		model.MoveTo(position);
	});
}
