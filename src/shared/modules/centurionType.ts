import { TransformResult, TypeBuilder } from "@rbxts/centurion";
import { values } from "@rbxts/object-utils";
import { Vehicle } from "./vehicle-spawn";

export const createEnumType = <T extends string>(name: string, enumObj: Record<string, T>) => {
	const enumValues = values(enumObj);

	const isEnum = (value: unknown): value is T => {
		return enumValues.includes(value as T);
	};

	return TypeBuilder.create<T>(name)
		.transform((text) => {
			if (isEnum(text)) {
				return TransformResult.ok(text);
			}

			return TransformResult.err(`Invalid ${name}: ${text}. Valid options: ${enumValues.join(", ")}`);
		})
		.suggestions(() => enumValues)
		.build();
};

export enum CustomCenturionType {
	VehicleName = "Vehicle",
}

export const vehicleCenturionType = createEnumType<Vehicle>(CustomCenturionType.VehicleName, Vehicle);
