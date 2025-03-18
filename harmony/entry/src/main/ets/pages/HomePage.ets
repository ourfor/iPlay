import { EmbyApi } from "../../../api/emby/EmbyApi"
import { SiteModel, MediaModel } from "../../../api/iPlayDataSource"
import { kv } from "../../../module/KVStorage"
import { router } from "../../../module/Router"
import { store } from "../store/Store"
import { AlbumMediaList, AlbumMediasModel } from "../view/AlbumMediaList"

@Entry
@Component
struct Index {
  @State albums: AlbumMediasModel[] = []

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
    .onAppear(async () => {
      // this.albums = await this.fetchData()
    })
  }



  onPageShow(): void {
    store.load()
    if (!store.site) {
      router.pushPage("pages/LoginPage", {})
      return
    }

    new Promise<void>(async () => {
      this.albums = await this.fetchData()
    })

  }

  async fetchData() {
    // local emby server for test
    let api = store.api
    let site = store.site
    if (api == null || site == null) {
      return []
    }
    await api.login(site);
    let albums = await api.getAllAlbums()
    albums.forEach(album => console.info("album: " + album.title + album.image?.primary))
    let album = new AlbumMediasModel();
    album.type = "albums"
    album.medias = albums.map(item => {
      let media: MediaModel = {
        id: item.id,
        title: item.title,
        image: item.image,
        type: "album",
        tags: null,
        overview: null,
        actors: null
      }
      return media
    })

    let resumes = await api!.getResume()
    let resumeAlbum = new AlbumMediasModel()
    resumeAlbum.id = "-2" ?? ""
    resumeAlbum.title = "Continue" ?? ""
    resumeAlbum.type = "resume"
    resumeAlbum.medias = resumes

    let albumMedias = await Promise.all(albums.map(async album => {
      let medias = await api!.getAlbumLatestMedias(album.id)
      let model = new AlbumMediasModel()
      model.id = album.id ?? ""
      model.title = album.title ?? ""
      model.type = "medias"
      model.medias = medias
      return model
    }))
    albumMedias = [resumeAlbum, ...albumMedias].filter(item => item.medias.length > 0)
    return [album, ...albumMedias]
  }
}