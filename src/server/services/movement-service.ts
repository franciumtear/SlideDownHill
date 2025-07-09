import Maid from "@rbxts/maid";
import { RunService } from "@rbxts/services";
import { $assert, $print } from "rbxts-transform-debug";

export namespace MovementService {
	let isStarted = false;

	export const start = () => {
		$assert(!isStarted, "MovementService.start() has already been called");

		isStarted = true;

		$print("MovementService started");
	};

	const weldVehicle = (vehicle: Model) => {
		if (!vehicle.PrimaryPart) {
			error(`Model "${vehicle.Name}" has no PrimaryPart.`);
		}

		const primary = vehicle.PrimaryPart;

		for (const part of vehicle.GetDescendants()) {
			if (part.IsA("BasePart") && part !== primary) {
				const weld = new Instance("WeldConstraint");
				weld.Part0 = primary;
				weld.Part1 = part;
				weld.Parent = part;
			}
		}
	};

	const speed = 10;
	const direction = new Vector3(0, 0, -1);

	export const moveVehicle = (vehicle: Model) => {
		weldVehicle(vehicle);
		for (const descendant of vehicle.GetDescendants()) {
			if (descendant.IsA("BasePart")) {
				descendant.Anchored = false;
			}
		}

		const maid = new Maid();

		maid.GiveTask(
			RunService.Heartbeat.Connect((dt) => {
				const moveVector = direction.Unit.mul(speed * dt);
				vehicle.TranslateBy(moveVector);
			}),
		);

		maid.GiveTask(
			vehicle.Destroying.Connect(() => {
				maid.DoCleaning();
			}),
		);
	};
}
