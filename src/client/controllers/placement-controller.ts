import { atom, effect } from "@rbxts/charm";
import Maid from "@rbxts/maid";
import Make from "@rbxts/make";
import { observeCharacter } from "@rbxts/observers";
import { Players, RunService, Workspace, UserInputService } from "@rbxts/services";
import { $assert, $print } from "rbxts-transform-debug";
import { remotes } from "shared/modules/remotes/remotes";
import { Vehicle, getVehicleData } from "shared/modules/vehicle-spawn";

export const placeArea = Workspace.Map.PlacingGround.WaitForChild("placeArea", 500) as BasePart; // this bitches otherwise

export const isPlaceable = (target: Part) => {
	const areaHalf = placeArea.Size.div(2);
	const areaCenter = placeArea.CFrame.Position;
	const areaMin = areaCenter.sub(areaHalf);
	const areaMax = areaCenter.add(areaHalf);

	const targetHalf = target.Size.div(2);
	const targetCenter = target.CFrame.Position;
	const targetMin = targetCenter.sub(targetHalf);
	const targetMax = targetCenter.add(targetHalf);

	return targetMin.X >= areaMin.X && targetMax.X <= areaMax.X && targetMin.Z >= areaMin.Z && targetMax.Z <= areaMax.Z;
};

export namespace PlacementController {
	let isStarted = false;
	export const placing = atom<Vehicle | undefined>(undefined);
	export const start = () => {
		$assert(!isStarted, "PlacementController.start() has already been called");

		isStarted = true;

		$print("PlacementController started");
		observeCharacter((player, character) => {
			$print("character added");
			if (player !== Players.LocalPlayer) {
				return;
			}
			const maid = new Maid();
			maid.GiveTask(() => {
				stopPlacing();
				$print("character deleted");
			});

			maid.GiveTask(
				effect(() => {
					$print(placing());
					const maid = new Maid();

					if (placing()) {
						const part = Make("Part", {
							Parent: Workspace,
							Anchored: true,
							CanQuery: false,
							Transparency: 0.5,
							Color: new Color3(0.69, 0.69, 0.69),
							CanCollide: false,
							Size: getVehicleData(placing() as Vehicle).model.GetBoundingBox()[1],
						});

						maid.GiveTask(
							RunService.Heartbeat.Connect(() => {
								const camera = Workspace.CurrentCamera!;
								const mouse = player.GetMouse();
								const mouseRay = camera?.ScreenPointToRay(mouse.X, mouse.Y);

								const parmas = new RaycastParams();
								parmas.AddToFilter(part);
								parmas.AddToFilter(character);
								parmas.AddToFilter(placeArea);

								const hit = Workspace.Raycast(mouseRay.Origin, mouseRay.Direction.mul(10000), parmas);
								if (hit) {
									part.CFrame = new CFrame(hit.Position);
									if (isPlaceable(part)) {
										part.Color = new Color3(0, 1, 0.05);
									} else {
										part.Color = new Color3(1, 0, 0);
									}
								}
							}),
						);

						maid.GiveTask(
							UserInputService.InputBegan.Connect((input, gameProcessed) => {
								if (gameProcessed) return;
								if (input.UserInputType === Enum.UserInputType.MouseButton1 && isPlaceable(part)) {
									$print(
										`${input.UserInputType} pressed, processed ${gameProcessed}, isPlaceable ${isPlaceable(part)}`,
									);
									remotes.spawn(placing() as Vehicle, part.CFrame.Position);
									placing(undefined);
								}
							}),
						);

						maid.GiveTask(part);
					}

					return () => maid.DoCleaning();
				}),
			);

			return () => maid.DoCleaning();
		});
	};
	export const startPlacing = (name: Vehicle) => {
		placing(name);
	};
	export const stopPlacing = () => {
		placing(undefined);
	};
}
