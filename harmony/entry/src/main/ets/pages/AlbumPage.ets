import { MediaModel, nil } from '../../../api/iPlayDataSource'
import { Dict, router } from '../../../module/Router'
import { store } from '../store/Store'
import { MediaCellView } from '../view/MediaCellView'

@Entry
@Component
struct AlbumPage {
  @State params: Dict = router.params()
  @State medias: MediaModel[]|nil = null
  @State albumId: string|nil = null
  @State actorId: string|nil = null

  constructor() {
    super()
  }

  build() {
    Column() {
      Grid() {
        ForEach(this.medias, (item: MediaModel) => {
          GridItem() {
            MediaCellView({ model: item })
          }
        }, (item: MediaModel) => item.id)
      }
      .columnsTemplate('1fr 1fr 1fr')
      .rowsGap(5)
      .columnsGap(5)
      .width('100%')
      .height('100%')
    }
  }

  onPageShow(): void {
    let albumId: string = this.params["albumId"] ?? "0"
    let actorId: string = this.params["actorId"] ?? "0"
    this.albumId = albumId
    this.actorId = actorId
    new Promise<void>(async () => {
      let query: Dict = {
        "IncludeItemTypes": "Movie,Series"
      };
      if (albumId != null) {
        query["ParentId"] = albumId
      }
      if (actorId != null) {
        query["PersonIds"] = actorId
      }
      this.medias = await store.api?.getMedias(query)
    })
  }

}