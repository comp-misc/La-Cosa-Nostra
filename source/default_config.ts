import { LcnConfig } from "./LcnConfig"
import configHandler from "./systems/config_handler"

export = configHandler("configuration.json", false) as LcnConfig
