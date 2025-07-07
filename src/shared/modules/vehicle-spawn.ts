import { values } from "@rbxts/object-utils";
import { ReplicatedStorage } from "@rbxts/services";
import { $assert } from "rbxts-transform-debug";

export enum Vehicle {
	Boat = "Boat",
}

export const isVehicle = (value: unknown): value is Vehicle => {
	return values(Vehicle).includes(value as Vehicle);
};

export type VehicleData = {
	model: Model;
	vehicle: Vehicle;
	name: string;
};

export const vehicleList: VehicleData[] = [
	{
		vehicle: Vehicle.Boat,
		name: "Boat",
		model: ReplicatedStorage.vehicles.Boat,
	},
];

export const vehicles = vehicleList.reduce(
	(acc, vehicle) => {
		$assert(acc[vehicle.vehicle] === undefined, `Vehicle ${vehicle.vehicle} already exists in vehicles`);

		acc[vehicle.vehicle] = vehicle;

		return acc;
	},
	{} as Record<Vehicle, VehicleData>,
);

export const getVehicleData = (vehicle: Vehicle): VehicleData => {
	$assert(vehicle in vehicles, `Vehicle ${vehicle} does not exist in vehicles`);

	return vehicles[vehicle];
};

for (const vehicle of values(Vehicle)) {
	$assert(getVehicleData(vehicle) !== undefined, `Vehicle ${vehicle} has not been defined`);
}
