interface ReplicatedStorage {
	TS: Folder & {
		module: ModuleScript;
		modules: Folder & {
			placement: ModuleScript;
			remotes: Folder & {
				remotes: ModuleScript;
			};
			"vehicle-spawn": ModuleScript;
		};
	};
	assets: Folder & {
		vehicles: Folder & {
			Boat: Model & {
				Part: Part & {
					OnlyCollideWithPlayers: BoolValue;
				};
			};
		};
	};
	rbxts_include: Folder & {
		Promise: ModuleScript;
		RuntimeLib: ModuleScript;
	};
}

interface ServerScriptService {
	TS: Folder & {
		main: Script;
		services: Folder & {
			"cli-service": Folder & {
				"cli-service": ModuleScript;
				commands: Folder;
				util: Folder & {
					"is-admin": ModuleScript;
				};
			};
			"spawn-service": ModuleScript;
		};
	};
}

interface Workspace {
	Map: Folder & {
		groundPart: Part;
		SpawnLocation: SpawnLocation & {
			Decal: Decal;
		};
		PlacingGround: Folder & {
			placeArea: Part;
			sea: Part;
		};
	};
}
