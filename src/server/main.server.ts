import { CliService } from "./services/cli-service/cli-service";
import { MovementService } from "./services/movement-service";
import { SpawnService } from "./services/spawn-service";

CliService.start();
SpawnService.start();
MovementService.start();
