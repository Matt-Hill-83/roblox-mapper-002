import { createRopeLabel } from "./ropeLabelMaker";

export class RopeLabelService {
  private static instance: RopeLabelService;
  private labelCount = 0;

  private constructor() {}

  public static getInstance(): RopeLabelService {
    if (!RopeLabelService.instance) {
      RopeLabelService.instance = new RopeLabelService();
    }
    return RopeLabelService.instance;
  }

  public createLabel(
    ropeIndex: number,
    relationTypeName: string,
    sourceAttachment: Attachment,
    targetAttachment: Attachment,
    parent: Instance,
    relationName?: string
  ): Model {
    const label = createRopeLabel({
      ropeIndex,
      relationTypeName,
      sourceAttachment,
      targetAttachment,
      parent,
      props: {
        relationName: relationName,
      },
    });

    this.labelCount++;
    print(
      `🏷️ RopeLabelService: Created label ${this.labelCount} for ${relationTypeName}`
    );

    return label;
  }

  public getLabelCount(): number {
    return this.labelCount;
  }

  public resetCount(): void {
    this.labelCount = 0;
    print("🔄 RopeLabelService: Reset label count");
  }
}
