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

@Data
@With
@Builder
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class EmbyDataSource {
    CopyOnWriteArrayList<EmbyModel.EmbyAlbumModel> albums;
    CopyOnWriteArrayList<EmbyModel.EmbyMediaModel> resume;

    ConcurrentHashMap<String, CopyOnWriteArrayList<EmbyModel.EmbyMediaModel>> albumMedias;
    ConcurrentHashMap<String, EmbyModel.EmbyMediaModel> mediaMap;
    ConcurrentHashMap<String, CopyOnWriteArrayList<EmbyModel.EmbyMediaModel>> seriesSeasons;
    ConcurrentHashMap<String, CopyOnWriteArrayList<EmbyModel.EmbyMediaModel>> seasonEpisodes;
}
