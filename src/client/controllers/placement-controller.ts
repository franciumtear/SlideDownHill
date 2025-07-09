import { atom, effect } from "@rbxts/charm";
import Maid from "@rbxts/maid";
import Make from "@rbxts/make";
import { observeCharacter } from "@rbxts/observers";
import { Players, RunService, Workspace, UserInputService } from "@rbxts/services";
import { $assert, $print } from "rbxts-transform-debug";
import { isPlaceable, placeArea } from "shared/modules/placement";
import { remotes } from "shared/modules/remotes/remotes";
import { Vehicle, getVehicleData } from "shared/modules/vehicle-spawn";

export namespace PlacementController {
	let isStarted = false;

	export const _placing = atom<Vehicle | undefined>(undefined);

	export const start = () => {
		$assert(!isStarted, "PlacementController.start() has already been called");

		isStarted = true;

		$print("PlacementController started");

		observeCharacter((player, character) => {
			if (player !== Players.LocalPlayer) {
				return;
			}

			const maid = new Maid();

			maid.GiveTask(() => {
				stopPlacing();
			});

			maid.GiveTask(
				effect(() => {
					const maid = new Maid();

					const placing = _placing();

					if (placing) {
						const vehicleData = getVehicleData(placing);

						const params = new RaycastParams();
						params.AddToFilter(character);
						params.AddToFilter(placeArea);

						const part = Make("Part", {
							Parent: Workspace,
							Anchored: true,
							CanQuery: false,
							Transparency: 0.5,
							Color: new Color3(0.69, 0.69, 0.69),
							CanCollide: false,
							Size: vehicleData.model.GetBoundingBox()[1],
						});

						maid.GiveTask(part);
						params.AddToFilter(part);

						const ghostModel = vehicleData.model.Clone();
						ghostModel.Parent = Workspace;

						ghostModel.GetDescendants().forEach((desc) => {
							if (desc.IsA("BasePart")) {
								desc.Anchored = true;
								desc.CanCollide = false;
								desc.Transparency = 0.4;
								params.AddToFilter(desc);
							}
						});

						maid.GiveTask(ghostModel);

						maid.GiveTask(
							RunService.Heartbeat.Connect(() => {
								const camera = Workspace.CurrentCamera!;
								const mouse = UserInputService.GetMouseLocation();
								const mouseRay = camera?.ScreenPointToRay(mouse.X, mouse.Y);

								const hit = Workspace.Raycast(mouseRay.Origin, mouseRay.Direction.mul(10000), params);
								if (hit) {
									const originalY = ghostModel.GetPivot().Position.Y;
									const newPosition = new Vector3(hit.Position.X, originalY, hit.Position.Z);
									const newCFrame = new CFrame(newPosition);

									part.CFrame = newCFrame;
									ghostModel.PivotTo(newCFrame);

									if (isPlaceable(hit.Position, placing)) {
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
								if (
									input.UserInputType === Enum.UserInputType.MouseButton1 &&
									isPlaceable(part.CFrame.Position, placing)
								) {
									remotes.spawn(placing, part.CFrame.Position);
									_placing(undefined);
								}
							}),
						);
					}

					return () => maid.DoCleaning();
				}),
			);

			return () => maid.DoCleaning();
		});
	};

	export const startPlacing = (name: Vehicle) => {
		_placing(name);
	};

	export const stopPlacing = () => {
		_placing(undefined);
	};
}
