package top.ourfor.app.iplayx.api.iplay;

import java.util.List;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.With;
import lombok.val;
import top.ourfor.app.iplayx.model.ActorModel;
import top.ourfor.app.iplayx.model.ImageModel;
import top.ourfor.app.iplayx.model.MediaModel;

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
    static public class ActorModel {
        String id;
        String name;
        String description;
        String sex;
        String avatar;
    }


    @Data
    @With
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MediaModel {
        String id;
        String siteId;
        String parentId;
        String title;
        String description;
        Image image;

        List<ActorModel> actors;


        public top.ourfor.app.iplayx.model.MediaModel toMediaModel() {
            val builder = top.ourfor.app.iplayx.model.MediaModel.builder();
            if (actors != null) {
                builder.actors(actors.stream().map(actor -> top.ourfor.app.iplayx.model.ActorModel.builder()
                        .id(actor.id)
                        .image(ImageModel.builder()
                                .primary(actor.avatar)
                                .build())
                        .name(actor.name)
                        .description(actor.description)
                        .build()).collect(Collectors.toList()));
            }
            return builder
                    .title(title)
                    .overview(description)
                    .seriesId(parentId)
                    .id(id)
                    .type("Movie")
                    .image(ImageModel.builder()
                            .thumb(image.backdrop)
                            .primary(image.primary)
                            .backdrop(image.backdrop)
                            .logo(image.logo)
                            .build())
                    .build();
        }
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
