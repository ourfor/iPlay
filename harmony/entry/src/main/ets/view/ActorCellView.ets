import { ActorModel, MediaModel, nil } from "../../../api/iPlayDataSource";
import { logger } from "../../../module/Log";
import { router } from "../../../module/Router";


@Component
export struct ActorCellView {
  @Prop model: ActorModel|nil;

  build() {
    Column() {
      Image(this.model?.avatar ?? "")
        .width(75)
        .aspectRatio(2/3)
        .margin(5)
        .borderRadius(10)
        .backgroundColor("#e5e5e5")
      Text(this.model?.name)
        .fontSize(14)
        .fontColor("#000000")
        .fontWeight(FontWeight.Normal)
        .lineBreakStrategy(LineBreakStrategy.HIGH_QUALITY)
        .textAlign(TextAlign.Center)
        .maxLines(1)
        .width(75)
    }
    .onClick(() => {
      logger.info(this.model?.name);
      router.pushPage("pages/AlbumPage", {
        media: this.model
      })
    })
  }
}