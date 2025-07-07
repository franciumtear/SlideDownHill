import { createRemotes, namespace, remote, Server } from "@rbxts/remo";
import { Vehicle } from "../vehicle-spawn";

export const remotes = createRemotes({
	spawn: remote<Server, [vehicle: Vehicle, position: Vector3]>(),
});
