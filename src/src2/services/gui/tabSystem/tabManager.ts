export class TabManager {
  private activeTab: string = "dataGeneration";
  private tabs: Map<string, Frame> = new Map();

  registerTab(name: string, frame: Frame): void {
    this.tabs.set(name, frame);
  }

  switchTab(tabName: string): void {
    // Hide all tabs
    this.tabs.forEach((frame) => {
      frame.Visible = false;
    });

    // Show selected tab
    const selectedTab = this.tabs.get(tabName);
    if (selectedTab) {
      selectedTab.Visible = true;
      this.activeTab = tabName;
    }
  }

  getActiveTab(): string {
    return this.activeTab;
  }
}