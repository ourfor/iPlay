package top.ourfor.app.iplayx.common.model;

import top.ourfor.app.iplayx.model.ImageModel;
import top.ourfor.app.iplayx.common.type.MediaLayoutType;

public interface IMediaModel {
    String getId();
    String getName();
    ImageModel getImage();
    default String getOverview() {
        return "";
    }
    default MediaLayoutType getLayoutType() {
        return MediaLayoutType.None;
    }
}
