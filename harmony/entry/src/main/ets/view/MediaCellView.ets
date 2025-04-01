import { MediaModel, nil } from "../../../api/iPlayDataSource";
import { logger } from "../../../module/Log";
import { router } from "../../../module/Router";


@Component
export struct MediaCellView {
  @Prop model: MediaModel|nil;

  public constructor(model: MediaModel|null) {
    super();
    this.model = model;
  }

  build() {
    Column() {
        Image(this.imageUrl())
          .width(this.cellWidth())
          .aspectRatio(this.cellImageAspect())
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
      logger.info(this.model?.title);
      router.pushPage(this.model?.type === "album" ? "pages/AlbumPage" : "pages/MediaPage", {
        media: this.model,
        albumId: this.model?.id
      })
    })
  }

  cellWidth() {
    let type = this.model?.type?.toLowerCase()
    let width = 100;
    if (type == "movie" || type == "episode") {
      width = 160;
    } else if (type == "album") {
      width = 110
    }
    return width
  }

  cellImageAspect() {
    let type = this.model?.type?.toLowerCase()
    let width = 2/3;
    if (type == "movie" || type == "episode") {
      width = 16/9;
    } else if (type == "album") {
      width = 16/9
    }
    return width
  }

  imageUrl() {
    let type = this.model?.type?.toLowerCase()
    if (type == "movie") {
      return this.model?.image?.backdrop ?? ""
    }
    return this.model?.image?.primary ?? ""
  }
}