import { EmbyApi } from "../../../api/emby/EmbyApi"
import { SiteModel } from "../../../api/iPlayDataSource"
import { AlbumMediaList, AlbumMediasModel } from "./AlbumMediaList"
import { MediaModel } from "./MediaCellView"

@Entry
@Component
struct Index {
  @State albums: AlbumMediasModel[] = this.fetchData()

  constructor() {
    super()
  }

  build() {
    Column() {
      List({ space: 5, initialIndex: 0 }) {
        ForEach(this.albums, (item: AlbumMediasModel) => {
          ListItem() {
            Column() {
              AlbumMediaList({
                model: item
              })
            }
          }
        }, (item: AlbumMediasModel) => item.id)
      }
      .listDirection(Axis.Vertical)
      .scrollBar(BarState.Off)
      .friction(0.6)
      .divider({ strokeWidth: 2, color: 0xFFFFFF, startMargin: 2, endMargin: 2 }) // 每行之间的分界线
      .edgeEffect(EdgeEffect.Spring)
      .onScrollIndex((firstIndex: number, lastIndex: number, centerIndex: number) => {
        console.info('first' + firstIndex)
        console.info('last' + lastIndex)
        console.info('center' + centerIndex)
      })
      .onScrollVisibleContentChange((start: VisibleListContentInfo, end: VisibleListContentInfo) => {
        console.log(' start index: ' + start.index +
          ' start item group area: ' + start.itemGroupArea +
          ' start index in group: ' + start.itemIndexInGroup)
        console.log(' end index: ' + end.index +
          ' end item group area: ' + end.itemGroupArea +
          ' end index in group: ' + end.itemIndexInGroup)
      })
      .onDidScroll((scrollOffset: number, scrollState: ScrollState) => {
        console.info(`onScroll scrollState = ScrollState` + scrollState + `, scrollOffset = ` + scrollOffset)
      })
      .width('100%')
    }
    .width('100%')
    .height("100%")
    .padding({ top: 5 })
  }

  fetchData() {
    let site: SiteModel = {
      id: null,
      server: "http://10.10.10.3:8096",
      username: "guest",
      password: "123abc$$"
    }

    let api = new EmbyApi()
    api.login(site).then(user => {
      console.log(`user: ${user}`);
    })

    let albums = ["A", "B", "C", "D", "E", "F"];
    let album = new AlbumMediasModel();
    album.type = "albums"
    album.medias = albums.map(item => {
      let media = new MediaModel()
      media.id = `album-${item}`
      media.title = `Album-${item}`
      media.type = "album"
      return media
    })
    let albumMedias = albums.map(item => {
      let id = `id-${item}`
      let title = `Album-${item}`
      let medias = ["1", "2", "3", "4", "5"].map(item => {
        let media = new MediaModel()
        media.id = `id-${item}`
        media.title = `Media-${item}`
        media.type = "media"
        return media
      })
      let model = new AlbumMediasModel()
      model.id = id
      model.title = title
      model.type = "medias"
      model.medias = medias
      return model
    })
    return [album, ...albumMedias]
  }
}