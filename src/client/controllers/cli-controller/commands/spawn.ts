import { CommandGuard, Register, Command, CenturionType, Guard, CommandContext, Group } from "@rbxts/centurion";
import { PlacementController } from "client/controllers/placement-controller";
import { CustomCenturionType } from "shared/modules/centurionType";
import { remotes } from "shared/modules/remotes/remotes";
import { isVehicle, Vehicle } from "shared/modules/vehicle-spawn";

@Register({
	groups: [
		{
			name: "vehicle",
			description: "Vehicle commands",
		},
	],
})
@Group("vehicle")
class SpawnCommand {
	@Command({
		name: "spawn",
		description: "Spawns a vehicle",
		arguments: [
			{
				name: "Vehicle",
				type: CustomCenturionType.VehicleName,
				description: "The vehicle to spawn",
			},
		],
	})
	spawn(ctx: CommandContext, vehicle: Vehicle) {
		PlacementController.startPlacing(vehicle);
	}

	@Command({
		name: "stop",
		description: "Stops spawning",
		arguments: [],
	})
	stop(ctx: CommandContext) {
		PlacementController.stopPlacing();
	}

	@Command({
		name: "move",
		description: "Moves spawned boat",
		arguments: [],
	})
	move(ctx: CommandContext) {
		remotes.move.fire();
	}
}
