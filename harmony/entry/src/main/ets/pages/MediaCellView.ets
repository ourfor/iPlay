export class MediaModel {
  id: string = ""
  type: string = ""
  title: string = "Media Title";
  image: string = "https://drive.ourfor.top/od_kiss/Primary.jpeg";
}

@Component
export struct MediaCellView {
  @Prop model: MediaModel|null = new MediaModel()

  public constructor(model: MediaModel|null) {
    super();
    this.model = model;
  }

  build() {
    Column() {
        Image(this.model?.image)
          .width(this.model?.type == "album" ? 120 : 90)
          .aspectRatio(this.model?.type == "media" ? 3/4 : 16/9)
          .margin(5)
          .borderRadius(5)
        Text(this.model?.title)
          .fontSize(16)
          .fontWeight(FontWeight.Normal)
    }
    .onClick(() => {
      console.log(this.model?.title);
    })
  }
}