import { ActorModel, MediaModel, nil } from '../../../api/iPlayDataSource'
import { Dict, router } from '../../../module/Router'
import { store } from '../store/Store'
import { ActorCellView } from '../view/ActorCellView'
import { MediaCellView } from '../view/MediaCellView'

@Entry
@Component
struct MediaPage {
  @State params: Dict = router.params()
  @State media: MediaModel|nil = null
  @State seasons: MediaModel[]|nil = null
  @State episodes: MediaModel[]|nil = null

  private  seasonEpisodes: MediaModel[][]|nil = null

  constructor() {
    super()
  }

  build() {
    Scroll() {
      Column() {
        Image(this.imageUrl())
          .width("100%")
          .aspectRatio(16 / 9)
          .onClick(() => {
            store.api?.getPlayback(this.media?.id ?? "").then(playback => {
              router.pushPage("pages/PlayerPage", {
                "playback": playback
              })
            })
          })

        if (this.media?.type?.toLowerCase() != "series") {
          Button('播 放')
            .width('90%')
            .height(40)
            .margin({ top: 10 })
            .backgroundColor('#000000')
            .fontColor(Color.White)
            .onClick(() => {
              store.api?.getPlayback(this.media?.id ?? "").then(playback => {
                router.pushPage("pages/PlayerPage", {
                  "playback": playback
                })
              })
            })
        }

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
        .margin({ top: 10 })

        Row() {
          Text(this.media?.overview ?? "")
            .fontSize(14)
            .width("100%")
        }
        .padding(5)
        .width("100%")

        Text($r("app.string.media_actor_list"))
          .width("100%")
          .fontWeight(FontWeight.Bold)
          .margin({ top: 5, bottom: 5 })
          .padding({ left: 5, right: 5 })
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

        Row() {
          List({ space: 5, initialIndex: 0 }) {
            if (this.seasons?.length ?? 0 > 0) {
              ListItem() {
                Text("All")
                  .fontColor("#ffffff")
                  .margin(5)
              }
              .onClick(() => {
                this.episodes = this.seasons
              })
              .backgroundColor("#000000")
              .borderRadius(5)
            }
            ForEach(this.seasons, (item: MediaModel, idx: number) => {
              ListItem() {
                Text(item.title ?? "")
                  .fontColor("#ffffff")
                  .margin(5)
              }
              .backgroundColor("#000000")
              .borderRadius(5)
              .onClick(() => {
                this.episodes = this.seasonEpisodes?.[idx] ?? []
              })
            }, (item: MediaModel) => item.id)
          }
          .height(32)
          .listDirection(Axis.Horizontal)
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
              .onSelect((selected) => {

              })
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
    new Promise<void>(async () => {
      let seasons = await store.api?.getSeasons(this.media?.id ?? "") ?? []
      seasons.forEach(season => console.log(`${season.title}`))
      this.seasons = seasons;

      this.episodes = seasons;
      // get episodes for each season
      let seasonEpisodes = await Promise.all(seasons.map(async season => await store.api?.getEpisodes(this.media?.id ?? "", season.id ?? "")));
      seasonEpisodes.forEach(items => items?.forEach(item => console.log(`${item.title}`)))
      this.seasonEpisodes = seasonEpisodes as MediaModel[][]
    })
  }

  imageUrl() {
    let type = this.media?.type?.toLowerCase()
    if (type == "movie") {
      return this.media?.image?.backdrop ?? ""
    }
    return this.media?.image?.primary ?? ""
  }

}