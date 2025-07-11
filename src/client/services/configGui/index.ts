export { ConfigGUIService } from "./makeConfigGui";
export type { ConfigGUIServiceOptions } from "./interfaces";
export { GUIStateManager } from "./stateManager";
export { GUIEventHandlers } from "./eventHandlers";
export { ComponentFactory } from "./componentFactory";
export * from "./validationHandlers";

// Export modular components
export { createDropdown } from "./components/dropdown";
export { createFrame } from "./components/frame";
export { createTitle } from "./components/title";