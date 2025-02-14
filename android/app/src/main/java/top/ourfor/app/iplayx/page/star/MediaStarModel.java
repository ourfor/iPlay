package top.ourfor.app.iplayx.page.star;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.With;
import top.ourfor.app.iplayx.api.emby.EmbyModel;
import top.ourfor.app.iplayx.common.type.MediaType;
import top.ourfor.app.iplayx.model.MediaModel;

@With
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MediaStarModel {
    String name;
    MediaType type;
    List<MediaModel> medias;
}
