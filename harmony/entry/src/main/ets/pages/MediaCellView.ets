import { MediaModel, nil } from "../../../api/iPlayDataSource";


@Component
export struct MediaCellView {
  @Prop model: MediaModel|nil;

  public constructor(model: MediaModel|null) {
    super();
    this.model = model;
  }

  build() {
    Column() {
        Image(this.model?.image?.primary)
          .width(this.model?.type == "album" ? 120 : 100)
          .aspectRatio(this.model?.type == "album" ? 16/9 : 2/3)
          .margin(5)
          .borderRadius(10)
        Text(this.model?.title)
          .fontSize(15)
          .fontWeight(FontWeight.Normal)
          .lineBreakStrategy(LineBreakStrategy.HIGH_QUALITY)
          .textAlign(TextAlign.Center)
          .maxLines(1)
          .width(100)
    }
    .onClick(() => {
      console.log(this.model?.title);
    })
  }
}