import { Workspace } from "@rbxts/services";
import { Vehicle, getVehicleData } from "shared/modules/vehicle-spawn";
import Make from "@rbxts/make";

export const placeArea = Workspace.Map.PlacingGround.placeArea;
assert(placeArea.IsA("BasePart"));

export const isPlaceable = (target: Vector3, vehicle: Vehicle) => {
	const areaHalf = placeArea.Size.div(2);
	const areaCenter = placeArea.CFrame.Position;
	const areaMin = areaCenter.sub(areaHalf);
	const areaMax = areaCenter.add(areaHalf);

	const boundingBox = Make("Part", {
		Transparency: 1,
		CanCollide: false,
		Position: target,
		Size: getVehicleData(vehicle).model.GetBoundingBox()[1],
	});

	const targetHalf = boundingBox.Size.div(2);
	const targetCenter = boundingBox.CFrame.Position;
	const targetMin = targetCenter.sub(targetHalf);
	const targetMax = targetCenter.add(targetHalf);

	const result =
		targetMin.X >= areaMin.X && targetMax.X <= areaMax.X && targetMin.Z >= areaMin.Z && targetMax.Z <= areaMax.Z;
	boundingBox.Destroy();
	return result;
};
