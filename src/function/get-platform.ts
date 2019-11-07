import { Platform } from "../interface/platform";

export const getPlatform = (): Platform => {
    return <Platform> process.env.NODE_PLATFORM;
}