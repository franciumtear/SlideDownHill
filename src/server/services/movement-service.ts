import Maid from "@rbxts/maid";
import { Workspace } from "@rbxts/services";
import { $assert, $print } from "rbxts-transform-debug";

export namespace MovementService {
	let isStarted = false;

	const speed = 10;
	const direction = new Vector3(0, 0, -1);

	const sea = Workspace.Map.PlacingGround.sea;

	export const start = () => {
		$assert(!isStarted, "MovementService.start() has already been called");
		isStarted = true;

		$print("MovementService started");

		sea.AssemblyLinearVelocity = direction.Unit.mul(speed);
	};

	const weldVehicle = (vehicle: Model) => {
		const primary = vehicle.PrimaryPart;

		if (primary) {
			for (const part of vehicle.GetDescendants()) {
				if (part.IsA("BasePart") && part !== primary) {
					const weld = new Instance("WeldConstraint");
					weld.Part0 = primary;
					weld.Part1 = part;
					weld.Parent = part;
				}
			}
		} else {
			$assert(`${vehicle.Name} has no primary part`);
		}
	};

	export const moveVehicle = (vehicle: Model) => {
		weldVehicle(vehicle);

		for (const part of vehicle.GetDescendants()) {
			if (part.IsA("BasePart")) {
				part.Anchored = false;
			}
		}

		const maid = new Maid();

		maid.GiveTask(
			vehicle.Destroying.Connect(() => {
				maid.DoCleaning();
			}),
		);
	};
}
