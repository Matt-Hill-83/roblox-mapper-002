import { createLabelGroup } from "shared/modules/labelGroupMaker";

export class LabelGroupService {
  private static instance: LabelGroupService;
  private labelCount = 0;

  private constructor() {}

  public static getInstance(): LabelGroupService {
    if (!LabelGroupService.instance) {
      LabelGroupService.instance = new LabelGroupService();
    }
    return LabelGroupService.instance;
  }

  public createLabelGroup(
    ropeIndex: number,
    sourceText: string,
    relationText: string,
    targetText: string,
    sourceAttachment: Attachment,
    targetAttachment: Attachment,
    parent: Instance,
    props?: { [key: string]: any }
  ): Model {
    const labelGroup = createLabelGroup({
      ropeIndex,
      sourceText,
      relationText,
      targetText,
      sourceAttachment,
      targetAttachment,
      parent,
      props,
    });

    this.labelCount++;
    print(
      `🏷️ LabelGroupService: Created label group ${this.labelCount} for ${sourceText} ${relationText} ${targetText}`
    );

    return labelGroup;
  }

  public getLabelCount(): number {
    return this.labelCount;
  }

  public resetCount(): void {
    this.labelCount = 0;
    print("🔄 LabelGroupService: Reset label count");
  }
}
