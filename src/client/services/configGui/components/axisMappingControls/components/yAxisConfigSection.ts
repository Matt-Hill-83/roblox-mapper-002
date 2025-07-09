import { AVAILABLE_PROPERTIES, UI_CONSTANTS } from "../constants";
import { createDropdown } from "./dropdown";
import { createRadioButton, updateRadioButtonState } from "./radioButton";
import { createSectionLabel, createButton, setButtonEnabled } from "../utils/layoutManager";

interface YAxisConfigSectionProps {
  parent: Frame;
  useLayerForYAxis: boolean;
  yAxisProperty?: string;
  onYAxisModeChange?: (useLayer: boolean) => void;
  onYAxisPropertyChange?: (property: string) => void;
}

/**
 * Creates the Y-axis configuration section of the controls
 */
export function createYAxisConfigSection({
  parent,
  useLayerForYAxis,
  yAxisProperty,
  onYAxisModeChange,
  onYAxisPropertyChange
}: YAxisConfigSectionProps): void {
  // Section label
  createSectionLabel(parent, "Y-Axis Configuration", 165);

  // Radio button container
  const radioContainer = new Instance("Frame");
  radioContainer.Name = "RadioContainer";
  radioContainer.Position = new UDim2(0, UI_CONSTANTS.SPACING.SECTION_MARGIN, 0, 185);
  radioContainer.Size = new UDim2(1, -UI_CONSTANTS.SPACING.SECTION_MARGIN * 2, 0, 50);
  radioContainer.BackgroundTransparency = 1;
  radioContainer.Parent = parent;

  // Use Layer option
  const useLayerRadio = createRadioButton({
    parent: radioContainer,
    position: new UDim2(0, 0, 0, 0),
    text: "Use Layer for Y Position",
    selected: useLayerForYAxis,
    onSelect: () => {
      if (!currentUseLayer) {
        currentUseLayer = true;
        updateRadioStates();
        updatePropertyButton();
        if (onYAxisModeChange) {
          onYAxisModeChange(true);
        }
      }
    }
  });

  // Use Property option frame
  const usePropertyFrame = new Instance("Frame");
  usePropertyFrame.Name = "UsePropertyFrame";
  usePropertyFrame.Position = new UDim2(0, 0, 0, 25);
  usePropertyFrame.Size = new UDim2(1, 0, 0, 20);
  usePropertyFrame.BackgroundTransparency = 1;
  usePropertyFrame.Parent = radioContainer;

  const usePropertyRadio = createRadioButton({
    parent: usePropertyFrame,
    position: new UDim2(0, 0, 0, 0),
    text: "Use Property:",
    selected: !useLayerForYAxis,
    onSelect: () => {
      if (currentUseLayer) {
        currentUseLayer = false;
        updateRadioStates();
        updatePropertyButton();
        if (onYAxisModeChange) {
          onYAxisModeChange(false);
        }
        // Create dropdown when switching to property mode
        if (onYAxisPropertyChange && yAxisPropertyButton) {
          createDropdown({
            button: yAxisPropertyButton,
            currentValue: yAxisPropertyButton.Text,
            onChange: onYAxisPropertyChange,
            parent: parent,
            properties: AVAILABLE_PROPERTIES
          });
        }
      }
    }
  });

  // Property dropdown button
  const yAxisPropertyButton = createButton(
    usePropertyFrame,
    "YAxisPropertyButton",
    yAxisProperty || "Select Property",
    new UDim2(0, 110, 0, -2),
    170
  );

  // Track current mode
  let currentUseLayer = useLayerForYAxis;

  // Helper functions
  function updateRadioStates() {
    updateRadioButtonState(useLayerRadio, currentUseLayer);
    updateRadioButtonState(usePropertyRadio, !currentUseLayer);
  }

  function updatePropertyButton() {
    setButtonEnabled(yAxisPropertyButton, !currentUseLayer);
  }

  // Initialize button state
  updatePropertyButton();

  // Create dropdown for Y-axis property when property mode is selected
  if (!currentUseLayer && onYAxisPropertyChange) {
    createDropdown({
      button: yAxisPropertyButton,
      currentValue: yAxisProperty || "type",
      onChange: onYAxisPropertyChange,
      parent: parent,
      properties: AVAILABLE_PROPERTIES
    });
  }
}