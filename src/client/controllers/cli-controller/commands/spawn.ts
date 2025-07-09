import { CommandGuard, Register, Command, CenturionType, Guard, CommandContext, Group } from "@rbxts/centurion";
import { PlacementController } from "client/controllers/placement-controller";
import { isVehicle } from "shared/modules/vehicle-spawn";

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
				name: "vehicle",
				type: CenturionType.String,
				description: "The vehicle to spawn",
			},
		],
	})
	spawn(ctx: CommandContext, vehicle: string) {
		if (isVehicle(vehicle)) {
			PlacementController.startPlacing(vehicle);
		} else {
			ctx.error(`Invalid state: ${vehicle}`);
		}
	}

	@Command({
		name: "stop",
		description: "Stops spawning",
		arguments: [],
	})
	stop(ctx: CommandContext) {
		PlacementController.stopPlacing();
	}
}
