import { ActorModel, MediaModel, nil } from '../../../api/iPlayDataSource'
import { Dict, router } from '../../../module/Router'
import { store } from '../store/Store'
import { ActorCellView } from '../view/ActorCellView'
import { MediaCellView } from '../view/MediaCellView'

@Entry
@Component
struct SeasonPage {
  @State params: Dict = router.params()
  @State media: MediaModel|nil = null
  @State episodes: MediaModel[]|nil = null

  private  seasonEpisodes: MediaModel[][]|nil = null

  constructor() {
    super()
  }

  build() {
    Scroll() {
      Column() {
        Row() {
          List() {
            ForEach(this.episodes, (item: MediaModel, idx: number) => {
              ListItem() {
                Text(item.title ?? "")
                  .fontColor("#ffffff")
                  .margin(5)
              }
              .backgroundColor("#000000")
              .borderRadius(5)
              .onClick(() => {
              })
            }, (item: MediaModel) => item.id)
          }
          .height(32)
          .listDirection(Axis.Vertical)
        }
        .padding(5)
        .width("100%")
        .height("auto")
        .flexGrow(0)
        .flexShrink(1)
        .margin({ top: 10 })

        Row() {
          List({ space: 5, initialIndex: 0 }) {
            ForEach(this.episodes, (item: MediaModel) => {
              ListItem() {
                MediaCellView({
                  model: item
                })
              }
              .borderRadius(5)
            }, (item: MediaModel) => item.id)
          }
          .height(180)
          .listDirection(Axis.Horizontal)
        }
        .padding(5)
        .width("100%")
        .height("auto")
        .flexGrow(0)
        .flexShrink(1)
        .margin({ top: 10 })
      }
    }
  }

  onPageShow(): void {
    this.media = this.params["media"]
    this.episodes = this.params["episodes"]
  }

  imageUrl() {
    let type = this.media?.type?.toLowerCase()
    if (type == "movie") {
      return this.media?.image?.backdrop ?? ""
    }
    return this.media?.image?.primary ?? ""
  }

}