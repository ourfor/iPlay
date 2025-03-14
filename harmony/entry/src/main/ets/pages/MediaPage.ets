import { ActorModel, MediaModel, nil } from '../../../api/iPlayDataSource'
import { Dict, router } from '../../../module/Router'
import { ActorCellView } from '../view/ActorCellView'

@Entry
@Component
struct MediaPage {
  @State params: Dict = router.params()
  @State media: MediaModel|nil = null

  constructor() {
    super()
  }

  build() {
    Column() {
      Image(this.media?.image?.backdrop)
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
      Text($r("app.string.media_actor_list"))
        .width("100%")
        .fontWeight(FontWeight.Bold)
        .margin({top: 5, bottom: 5})
        .padding({left: 5, right: 5})
      Row() {
        List({ space: 5, initialIndex: 0 }) {
          ForEach(this.media?.actors, (actor: ActorModel) => {
            ListItem() {
              ActorCellView({
                model: actor
              })
            }
          }, (item: ActorModel) => item.id)
        }
        .width("100%")
        .height(150)
        .listDirection(Axis.Horizontal)
        .scrollBar(BarState.Off)
      }
    }
  }

  onPageShow(): void {
    this.media = this.params["media"]
  }

}