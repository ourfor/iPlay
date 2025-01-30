package top.ourfor.app.iplayx.store;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.With;
import top.ourfor.app.iplayx.api.emby.EmbyModel;
import top.ourfor.app.iplayx.model.AlbumModel;
import top.ourfor.app.iplayx.model.MediaModel;

@Data
@With
@Builder
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class DataSource {
    CopyOnWriteArrayList<AlbumModel> albums;
    CopyOnWriteArrayList<MediaModel> resume;
    ConcurrentHashMap<String, CopyOnWriteArrayList<MediaModel>> albumMedias;
    ConcurrentHashMap<String, MediaModel> mediaMap;
    ConcurrentHashMap<String, CopyOnWriteArrayList<MediaModel>> seriesSeasons;
    ConcurrentHashMap<String, CopyOnWriteArrayList<MediaModel>> seasonEpisodes;
}
