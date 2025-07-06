import { UserInputService } from "@rbxts/services";
import { Players } from "@rbxts/services";

const KEYBOARD_CONSTANTS = {
    ESC_TIMEOUT: 2000, // 2 seconds to press P after Esc
    CONFIRMATION_TIMEOUT: 5000, // 5 seconds to confirm quit
};

export class KeyboardShortcutsService {
    private escPressed = false;
    private escPressTime = 0;
    private confirmationGui?: ScreenGui;

    constructor() {
        this.setupInputHandlers();
    }

    private setupInputHandlers(): void {
        UserInputService.InputBegan.Connect((input, gameProcessed) => {
            // Ignore input if GUI is capturing it
            if (gameProcessed) return;

            if (input.KeyCode === Enum.KeyCode.Escape) {
                this.handleEscapePress();
            } else if (input.KeyCode === Enum.KeyCode.P && this.escPressed) {
                const timeSinceEsc = tick() - this.escPressTime;
                if (timeSinceEsc <= KEYBOARD_CONSTANTS.ESC_TIMEOUT / 1000) {
                    this.showQuitConfirmation();
                }
                this.escPressed = false;
            } else {
                // Any other key cancels the Esc+P sequence
                this.escPressed = false;
            }
        });
    }

    private handleEscapePress(): void {
        this.escPressed = true;
        this.escPressTime = tick();

        // Show visual feedback
        this.showEscapeFeedback();

        // Clear escape state after timeout
        task.wait(KEYBOARD_CONSTANTS.ESC_TIMEOUT / 1000);
        this.escPressed = false;
    }

    private showEscapeFeedback(): void {
        const player = Players.LocalPlayer;
        if (!player) return;
        const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;
        if (!playerGui) return;

        // Create temporary feedback GUI
        const feedbackGui = new Instance("ScreenGui");
        feedbackGui.Name = "EscapeFeedback";
        feedbackGui.ResetOnSpawn = false;
        feedbackGui.Parent = playerGui;

        const feedbackFrame = new Instance("Frame");
        feedbackFrame.Size = new UDim2(0, 200, 0, 50);
        feedbackFrame.Position = new UDim2(0.5, -100, 0, 50);
        feedbackFrame.BackgroundColor3 = new Color3(0.2, 0.2, 0.2);
        feedbackFrame.BackgroundTransparency = 0.2;
        feedbackFrame.BorderSizePixel = 0;
        feedbackFrame.Parent = feedbackGui;

        const feedbackText = new Instance("TextLabel");
        feedbackText.Size = new UDim2(1, 0, 1, 0);
        feedbackText.Text = "Press P to quit";
        feedbackText.TextColor3 = new Color3(1, 1, 1);
        feedbackText.TextScaled = true;
        feedbackText.BackgroundTransparency = 1;
        feedbackText.Font = Enum.Font.SourceSans;
        feedbackText.Parent = feedbackFrame;

        // Remove feedback after timeout
        task.wait(KEYBOARD_CONSTANTS.ESC_TIMEOUT / 1000);
        feedbackGui.Destroy();
    }

    private showQuitConfirmation(): void {
        const player = Players.LocalPlayer;
        if (!player) return;
        const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;
        if (!playerGui) return;

        // Prevent multiple confirmation dialogs
        if (this.confirmationGui) {
            this.confirmationGui.Destroy();
        }

        // Create confirmation dialog
        this.confirmationGui = new Instance("ScreenGui");
        this.confirmationGui.Name = "QuitConfirmation";
        this.confirmationGui.ResetOnSpawn = false;
        this.confirmationGui.Parent = playerGui;

        const backgroundFrame = new Instance("Frame");
        backgroundFrame.Size = new UDim2(1, 0, 1, 0);
        backgroundFrame.BackgroundColor3 = new Color3(0, 0, 0);
        backgroundFrame.BackgroundTransparency = 0.5;
        backgroundFrame.Parent = this.confirmationGui;

        const dialogFrame = new Instance("Frame");
        dialogFrame.Size = new UDim2(0, 400, 0, 200);
        dialogFrame.Position = new UDim2(0.5, -200, 0.5, -100);
        dialogFrame.BackgroundColor3 = new Color3(0.15, 0.15, 0.15);
        dialogFrame.BorderSizePixel = 0;
        dialogFrame.Parent = this.confirmationGui;

        const titleText = new Instance("TextLabel");
        titleText.Size = new UDim2(1, 0, 0, 50);
        titleText.Text = "Quit Game?";
        titleText.TextColor3 = new Color3(1, 1, 1);
        titleText.TextScaled = true;
        titleText.BackgroundTransparency = 1;
        titleText.Font = Enum.Font.SourceSansBold;
        titleText.Parent = dialogFrame;

        const messageText = new Instance("TextLabel");
        messageText.Size = new UDim2(1, -20, 0, 50);
        messageText.Position = new UDim2(0, 10, 0, 60);
        messageText.Text = "Are you sure you want to quit the game?";
        messageText.TextColor3 = new Color3(0.8, 0.8, 0.8);
        messageText.TextScaled = true;
        messageText.BackgroundTransparency = 1;
        messageText.Font = Enum.Font.SourceSans;
        messageText.Parent = dialogFrame;

        const buttonContainer = new Instance("Frame");
        buttonContainer.Size = new UDim2(1, -20, 0, 40);
        buttonContainer.Position = new UDim2(0, 10, 1, -50);
        buttonContainer.BackgroundTransparency = 1;
        buttonContainer.Parent = dialogFrame;

        const confirmButton = new Instance("TextButton");
        confirmButton.Size = new UDim2(0.45, 0, 1, 0);
        confirmButton.Position = new UDim2(0, 0, 0, 0);
        confirmButton.Text = "Quit";
        confirmButton.TextColor3 = new Color3(1, 1, 1);
        confirmButton.TextScaled = true;
        confirmButton.BackgroundColor3 = new Color3(0.8, 0.2, 0.2);
        confirmButton.Font = Enum.Font.SourceSans;
        confirmButton.Parent = buttonContainer;

        const cancelButton = new Instance("TextButton");
        cancelButton.Size = new UDim2(0.45, 0, 1, 0);
        cancelButton.Position = new UDim2(0.55, 0, 0, 0);
        cancelButton.Text = "Cancel";
        cancelButton.TextColor3 = new Color3(1, 1, 1);
        cancelButton.TextScaled = true;
        cancelButton.BackgroundColor3 = new Color3(0.3, 0.3, 0.3);
        cancelButton.Font = Enum.Font.SourceSans;
        cancelButton.Parent = buttonContainer;

        // Handle button clicks
        confirmButton.MouseButton1Click.Connect(() => {
            this.quitGame();
        });

        cancelButton.MouseButton1Click.Connect(() => {
            if (this.confirmationGui) {
                this.confirmationGui.Destroy();
                this.confirmationGui = undefined;
            }
        });

        // Auto-dismiss after timeout
        task.wait(KEYBOARD_CONSTANTS.CONFIRMATION_TIMEOUT / 1000);
        if (this.confirmationGui) {
            this.confirmationGui.Destroy();
            this.confirmationGui = undefined;
        }
    }

    private quitGame(): void {
        const player = Players.LocalPlayer;
        if (player) {
            // Kick the player to quit the game
            player.Kick("You have quit the game.");
        }
    }

    public destroy(): void {
        if (this.confirmationGui) {
            this.confirmationGui.Destroy();
            this.confirmationGui = undefined;
        }
    }
}