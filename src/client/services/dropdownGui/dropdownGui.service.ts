import { Players } from "@rbxts/services";
import { BaseService } from "../../../shared/services/base/BaseService";
import { GUI_CONSTANTS } from "./constants";

export class DropdownGuiService extends BaseService {
  private gui?: ScreenGui;
  private mainFrame?: Frame;
  private dropdownButton?: TextButton;
  private optionsFrame?: Frame;
  private isDropdownOpen = false;
  private currentSelection = GUI_CONSTANTS.DROPDOWN.DEFAULT_TEXT;

  constructor() {
    super("DropdownGuiService");
  }

  public initialize(): void {
    print("[DropdownGuiService] Initializing...");
    this.createGUI();
  }

  private createGUI(): void {
    const player = Players.LocalPlayer;
    const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

    // Create ScreenGui
    this.gui = new Instance("ScreenGui");
    this.gui.Name = GUI_CONSTANTS.NAMES.SCREEN_GUI;
    this.gui.ResetOnSpawn = false;
    this.gui.Parent = playerGui;

    // Create main frame
    this.mainFrame = this.createMainFrame();
    this.mainFrame.Parent = this.gui;

    // Create title
    const titleLabel = this.createTitleLabel();
    titleLabel.Parent = this.mainFrame;

    // Create dropdown button
    this.dropdownButton = this.createDropdownButton();
    this.dropdownButton.Parent = this.mainFrame;

    // Create options list (initially hidden)
    this.optionsFrame = this.createOptionsList();
    this.optionsFrame.Visible = false;
    this.optionsFrame.Parent = this.mainFrame;

    print("[DropdownGuiService] GUI created successfully");
  }

  private createMainFrame(): Frame {
    const frame = new Instance("Frame");
    frame.Name = GUI_CONSTANTS.NAMES.MAIN_FRAME;
    frame.Size = new UDim2(0, GUI_CONSTANTS.FRAME.WIDTH, 0, GUI_CONSTANTS.FRAME.HEIGHT);
    frame.Position = GUI_CONSTANTS.FRAME.POSITION;
    frame.BackgroundColor3 = GUI_CONSTANTS.FRAME.BACKGROUND_COLOR;
    frame.BorderSizePixel = 0;

    // Add corner radius
    const corner = new Instance("UICorner");
    corner.CornerRadius = GUI_CONSTANTS.FRAME.CORNER_RADIUS;
    corner.Parent = frame;

    return frame;
  }

  private createTitleLabel(): TextLabel {
    const label = new Instance("TextLabel");
    label.Name = GUI_CONSTANTS.NAMES.TITLE_LABEL;
    label.Text = GUI_CONSTANTS.TITLE.TEXT;
    label.Position = GUI_CONSTANTS.TITLE.POSITION;
    label.Size = GUI_CONSTANTS.TITLE.SIZE;
    label.BackgroundTransparency = 1;
    label.TextColor3 = GUI_CONSTANTS.TITLE.TEXT_COLOR;
    label.Font = GUI_CONSTANTS.TITLE.FONT;
    label.TextScaled = false;
    label.TextSize = GUI_CONSTANTS.TITLE.TEXT_SIZE;
    
    return label;
  }

  private createDropdownButton(): TextButton {
    const button = new Instance("TextButton");
    button.Name = GUI_CONSTANTS.NAMES.DROPDOWN_BUTTON;
    button.Text = this.currentSelection + " ▼";
    button.Position = GUI_CONSTANTS.DROPDOWN.POSITION;
    button.Size = GUI_CONSTANTS.DROPDOWN.SIZE;
    button.BackgroundColor3 = GUI_CONSTANTS.DROPDOWN.BACKGROUND_COLOR;
    button.TextColor3 = GUI_CONSTANTS.DROPDOWN.TEXT_COLOR;
    button.Font = Enum.Font.SourceSans;
    button.TextScaled = false;
    button.TextSize = 16;
    button.BorderSizePixel = 0;

    // Add corner radius
    const corner = new Instance("UICorner");
    corner.CornerRadius = new UDim(0, 4);
    corner.Parent = button;

    // Add hover effect
    button.MouseEnter.Connect(() => {
      button.BackgroundColor3 = GUI_CONSTANTS.DROPDOWN.HOVER_COLOR;
    });

    button.MouseLeave.Connect(() => {
      button.BackgroundColor3 = GUI_CONSTANTS.DROPDOWN.BACKGROUND_COLOR;
    });

    // Add click handler
    button.MouseButton1Click.Connect(() => this.toggleDropdown());

    return button;
  }

  private createOptionsList(): Frame {
    const frame = new Instance("Frame");
    frame.Name = GUI_CONSTANTS.NAMES.OPTIONS_FRAME;
    frame.Position = GUI_CONSTANTS.OPTIONS.POSITION;
    frame.Size = GUI_CONSTANTS.OPTIONS.SIZE;
    frame.BackgroundColor3 = GUI_CONSTANTS.OPTIONS.BACKGROUND_COLOR;
    frame.BorderSizePixel = 0;

    // Add corner radius
    const corner = new Instance("UICorner");
    corner.CornerRadius = new UDim(0, 4);
    corner.Parent = frame;

    // Create option buttons
    GUI_CONSTANTS.OPTIONS.OPTIONS.forEach((option, index) => {
      const optionButton = this.createOptionButton(option, index);
      optionButton.Parent = frame;
    });

    return frame;
  }

  private createOptionButton(text: string, index: number): TextButton {
    const button = new Instance("TextButton");
    button.Name = `Option_${text}`;
    button.Text = text;
    button.Position = new UDim2(0, 5, 0, index * GUI_CONSTANTS.OPTIONS.OPTION_HEIGHT + 5);
    button.Size = new UDim2(1, -10, 0, GUI_CONSTANTS.OPTIONS.OPTION_HEIGHT - 5);
    button.BackgroundColor3 = GUI_CONSTANTS.DROPDOWN.BACKGROUND_COLOR;
    button.TextColor3 = GUI_CONSTANTS.DROPDOWN.TEXT_COLOR;
    button.Font = Enum.Font.SourceSans;
    button.TextScaled = false;
    button.TextSize = 16;
    button.BorderSizePixel = 0;

    // Add corner radius
    const corner = new Instance("UICorner");
    corner.CornerRadius = new UDim(0, 4);
    corner.Parent = button;

    // Add hover effect
    button.MouseEnter.Connect(() => {
      button.BackgroundColor3 = GUI_CONSTANTS.DROPDOWN.HOVER_COLOR;
    });

    button.MouseLeave.Connect(() => {
      button.BackgroundColor3 = GUI_CONSTANTS.DROPDOWN.BACKGROUND_COLOR;
    });

    // Add click handler
    button.MouseButton1Click.Connect(() => this.selectOption(text));

    return button;
  }

  private toggleDropdown(): void {
    if (!this.optionsFrame) return;

    this.isDropdownOpen = !this.isDropdownOpen;
    this.optionsFrame.Visible = this.isDropdownOpen;
    
    print(`[DropdownGuiService] Dropdown ${this.isDropdownOpen ? "opened" : "closed"}`);
  }

  private selectOption(option: string): void {
    this.currentSelection = option;
    
    // Update button text
    if (this.dropdownButton) {
      this.dropdownButton.Text = this.currentSelection + " ▼";
    }

    // Print to console
    print(`[DropdownGuiService] Selected option: ${option}`);

    // Hide dropdown
    this.isDropdownOpen = false;
    if (this.optionsFrame) {
      this.optionsFrame.Visible = false;
    }
  }

  protected onDestroy(): void {
    if (this.gui) {
      this.gui.Destroy();
      this.gui = undefined;
    }
    
    print("[DropdownGuiService] Destroyed");
  }
}