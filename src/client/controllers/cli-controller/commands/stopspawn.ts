import { CommandGuard, Register, Command, CenturionType, Guard, CommandContext } from "@rbxts/centurion";
import { PlacementController } from "client/controllers/placement-controller";
import { isVehicle } from "shared/modules/vehicle-spawn";

@Register()
class StopSpawnCommand {
	@Command({
		name: "stopspawn",
		description: "Stops spawning",
		arguments: [],
	})
	spawn(ctx: CommandContext) {
		PlacementController.stopPlacing();
	}
}
