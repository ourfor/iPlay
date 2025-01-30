package top.ourfor.app.iplayx.api.iplay;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.With;

public class iPlayModel {

    @Data
    @With
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Image {
        public String backdrop;
        public String primary;
        public String logo;
    }

    @Data
    @With
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response<T> {
        public int code;
        public String message;
        public T data;
    }

    @Data
    @With
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AlbumModel {
        public String id;
        public String parentId;
        public String name;
        public Image image;
    }

    @Data
    @With
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MediaModel {
        public String id;
        public String siteId;
        public String parentId;
        public String title;
        public String description;
        public Image image;
    }

    @Data
    @With
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SourceModel {
        public String name;
        public String type;
        public String url;
    }
}
