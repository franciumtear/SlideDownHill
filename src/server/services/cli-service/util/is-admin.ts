import { CommandGuard } from "@rbxts/centurion";
import { RunService } from "@rbxts/services";

export const isAdmin: CommandGuard = (ctx) => {
	if (RunService.IsStudio()) {
		return true;
	}

	if (ctx.executor.UserId !== 3745566341) {
		ctx.error("Insufficient permission!");
		return false;
	}

	return true;
};
