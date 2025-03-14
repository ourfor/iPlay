import { MediaModel, nil } from '../../../api/iPlayDataSource'
import { Dict, router } from '../../../module/Router'

@Entry
@Component
struct AlbumPage {
  @State params: Dict = router.params()
  @State media: MediaModel|nil = null

  constructor() {
    super()
  }

  build() {
    Column() {
      Image(this.media?.image?.backdrop ?? "")
        .width("100%")
        .aspectRatio(16/9)
      Row() {
        List({ space: 5, initialIndex: 0 }) {
          ForEach(this.media?.tags, (item: string) => {
            ListItem() {
              Text(item)
                .fontColor("#ffffff")
                .margin(5)
            }
            .backgroundColor("#000000")
            .borderRadius(5)
          }, (item: string) => item)
        }
        .height(32)
        .listDirection(Axis.Horizontal)
      }
      .padding(5)
      .width("100%")
      .height("auto")
      .flexGrow(0)
      .flexShrink(1)
      .margin({top: 10})
      Row() {
        Text(this.media?.overview)
          .fontSize(14)
          .width("100%")
      }
      .padding(5)
      .width("100%")

      Row() {
        List({ space: 5, initialIndex: 0 }) {
          ForEach(this.media?.tags, (item: string) => {
            ListItem() {
              Text(item)
                .fontColor("#ffffff")
                .margin(5)
            }
            .backgroundColor("#000000")
            .borderRadius(5)
          }, (item: string) => item)
        }
        .height(90)
        .listDirection(Axis.Horizontal)
      }
    }
  }

  onPageShow(): void {
    this.media = this.params["media"]
  }

}