package top.ourfor.app.iplayx.api.iplay;

import static top.ourfor.app.iplayx.module.Bean.XGET;

import com.fasterxml.jackson.core.type.TypeReference;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.CountDownLatch;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Setter;
import lombok.With;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import top.ourfor.app.iplayx.api.emby.EmbyModel;
import top.ourfor.app.iplayx.bean.JSONAdapter;
import top.ourfor.app.iplayx.common.api.EmbyLikeApi;
import top.ourfor.app.iplayx.common.model.SiteEndpointModel;
import top.ourfor.app.iplayx.common.type.MediaLayoutType;
import top.ourfor.app.iplayx.common.type.MediaPlayState;
import top.ourfor.app.iplayx.model.AlbumModel;
import top.ourfor.app.iplayx.model.ImageModel;
import top.ourfor.app.iplayx.model.MediaModel;
import top.ourfor.app.iplayx.model.SiteModel;
import top.ourfor.app.iplayx.model.UserModel;
import top.ourfor.app.iplayx.store.GlobalStore;
import top.ourfor.app.iplayx.util.Base64Util;
import top.ourfor.app.iplayx.util.HTTPModel;
import top.ourfor.app.iplayx.util.HTTPUtil;

@With
@Slf4j
@Setter
@Builder
@EqualsAndHashCode
public class iPlayApi implements EmbyLikeApi {
    private static final String kDeviceProfile = "{\"DeviceProfile\":{\"MaxStaticBitrate\":140000000,\"MaxStreamingBitrate\":140000000,\"MusicStreamingTranscodingBitrate\":192000,\"DirectPlayProfiles\":[{\"Container\":\"mp4,m4v\",\"Type\":\"Video\",\"VideoCodec\":\"h264,h265,hevc,vp8,vp9\",\"AudioCodec\":\"mp3,aac,opus,flac,vorbis\"},{\"Container\":\"mkv\",\"Type\":\"Video\",\"VideoCodec\":\"h264,h265,hevc,vp8,vp9\",\"AudioCodec\":\"mp3,aac,opus,flac,vorbis\"},{\"Container\":\"flv\",\"Type\":\"Video\",\"VideoCodec\":\"h264\",\"AudioCodec\":\"aac,mp3\"},{\"Container\":\"mov\",\"Type\":\"Video\",\"VideoCodec\":\"h264\",\"AudioCodec\":\"mp3,aac,opus,flac,vorbis\"},{\"Container\":\"opus\",\"Type\":\"Audio\"},{\"Container\":\"mp3\",\"Type\":\"Audio\",\"AudioCodec\":\"mp3\"},{\"Container\":\"mp2,mp3\",\"Type\":\"Audio\",\"AudioCodec\":\"mp2\"},{\"Container\":\"aac\",\"Type\":\"Audio\",\"AudioCodec\":\"aac\"},{\"Container\":\"m4a\",\"AudioCodec\":\"aac\",\"Type\":\"Audio\"},{\"Container\":\"mp4\",\"AudioCodec\":\"aac\",\"Type\":\"Audio\"},{\"Container\":\"flac\",\"Type\":\"Audio\"},{\"Container\":\"webma,webm\",\"Type\":\"Audio\"},{\"Container\":\"wav\",\"Type\":\"Audio\",\"AudioCodec\":\"PCM_S16LE,PCM_S24LE\"},{\"Container\":\"ogg\",\"Type\":\"Audio\"},{\"Container\":\"webm\",\"Type\":\"Video\",\"AudioCodec\":\"vorbis,opus\",\"VideoCodec\":\"VP8,VP9\"}],\"TranscodingProfiles\":[{\"Container\":\"aac\",\"Type\":\"Audio\",\"AudioCodec\":\"aac\",\"Context\":\"Streaming\",\"Protocol\":\"hls\",\"MaxAudioChannels\":\"2\",\"MinSegments\":\"2\",\"BreakOnNonKeyFrames\":true},{\"Container\":\"aac\",\"Type\":\"Audio\",\"AudioCodec\":\"aac\",\"Context\":\"Streaming\",\"Protocol\":\"http\",\"MaxAudioChannels\":\"2\"},{\"Container\":\"mp3\",\"Type\":\"Audio\",\"AudioCodec\":\"mp3\",\"Context\":\"Streaming\",\"Protocol\":\"http\",\"MaxAudioChannels\":\"2\"},{\"Container\":\"opus\",\"Type\":\"Audio\",\"AudioCodec\":\"opus\",\"Context\":\"Streaming\",\"Protocol\":\"http\",\"MaxAudioChannels\":\"2\"},{\"Container\":\"wav\",\"Type\":\"Audio\",\"AudioCodec\":\"wav\",\"Context\":\"Streaming\",\"Protocol\":\"http\",\"MaxAudioChannels\":\"2\"},{\"Container\":\"opus\",\"Type\":\"Audio\",\"AudioCodec\":\"opus\",\"Context\":\"Static\",\"Protocol\":\"http\",\"MaxAudioChannels\":\"2\"},{\"Container\":\"mp3\",\"Type\":\"Audio\",\"AudioCodec\":\"mp3\",\"Context\":\"Static\",\"Protocol\":\"http\",\"MaxAudioChannels\":\"2\"},{\"Container\":\"aac\",\"Type\":\"Audio\",\"AudioCodec\":\"aac\",\"Context\":\"Static\",\"Protocol\":\"http\",\"MaxAudioChannels\":\"2\"},{\"Container\":\"wav\",\"Type\":\"Audio\",\"AudioCodec\":\"wav\",\"Context\":\"Static\",\"Protocol\":\"http\",\"MaxAudioChannels\":\"2\"},{\"Container\":\"mkv\",\"Type\":\"Video\",\"AudioCodec\":\"mp3,aac,opus,flac,vorbis\",\"VideoCodec\":\"h264,h265,hevc,vp8,vp9\",\"Context\":\"Static\",\"MaxAudioChannels\":\"2\",\"CopyTimestamps\":true},{\"Container\":\"m4s,ts\",\"Type\":\"Video\",\"AudioCodec\":\"mp3,aac\",\"VideoCodec\":\"h264,h265,hevc\",\"Context\":\"Streaming\",\"Protocol\":\"hls\",\"MaxAudioChannels\":\"2\",\"MinSegments\":\"2\",\"BreakOnNonKeyFrames\":true,\"ManifestSubtitles\":\"vtt\"},{\"Container\":\"webm\",\"Type\":\"Video\",\"AudioCodec\":\"vorbis\",\"VideoCodec\":\"vpx\",\"Context\":\"Streaming\",\"Protocol\":\"http\",\"MaxAudioChannels\":\"2\"},{\"Container\":\"mp4\",\"Type\":\"Video\",\"AudioCodec\":\"mp3,aac,opus,flac,vorbis\",\"VideoCodec\":\"h264\",\"Context\":\"Static\",\"Protocol\":\"http\"}],\"ContainerProfiles\":[],\"CodecProfiles\":[{\"Type\":\"VideoAudio\",\"Codec\":\"aac\",\"Conditions\":[{\"Condition\":\"Equals\",\"Property\":\"IsSecondaryAudio\",\"Value\":\"false\",\"IsRequired\":\"false\"}]},{\"Type\":\"VideoAudio\",\"Conditions\":[{\"Condition\":\"Equals\",\"Property\":\"IsSecondaryAudio\",\"Value\":\"false\",\"IsRequired\":\"false\"}]},{\"Type\":\"Video\",\"Codec\":\"h264\",\"Conditions\":[{\"Condition\":\"EqualsAny\",\"Property\":\"VideoProfile\",\"Value\":\"high|main|baseline|constrained baseline|high 10\",\"IsRequired\":false},{\"Condition\":\"LessThanEqual\",\"Property\":\"VideoLevel\",\"Value\":\"62\",\"IsRequired\":false}]},{\"Type\":\"Video\",\"Codec\":\"hevc\",\"Conditions\":[{\"Condition\":\"EqualsAny\",\"Property\":\"VideoCodecTag\",\"Value\":\"hvc1\",\"IsRequired\":false}]}],\"SubtitleProfiles\":[{\"Format\":\"vtt\",\"Method\":\"Hls\"},{\"Format\":\"eia_608\",\"Method\":\"VideoSideData\",\"Protocol\":\"hls\"},{\"Format\":\"eia_708\",\"Method\":\"VideoSideData\",\"Protocol\":\"hls\"},{\"Format\":\"vtt\",\"Method\":\"External\"},{\"Format\":\"ass\",\"Method\":\"External\"},{\"Format\":\"ssa\",\"Method\":\"External\"}],\"ResponseProfiles\":[{\"Type\":\"Video\",\"Container\":\"m4v\",\"MimeType\":\"video/mp4\"}]}}\n";

    SiteModel site;

    public static void login(String server, String username, String password, Consumer<Object> completion) {
        val token = "Basic " + Base64Util.encode(username + ":" + password);
        log.info("Login to server: {}", server);
        HTTPModel model = HTTPModel.builder()
                .url(server + "/sites")
                .method("POST")
                .headers(Map.of(
                        "Content-Type", "application/json",
                        "Authorization", token
                ))
                .body("{}")
                .typeReference(new TypeReference<iPlayModel.Response<String>>() {})
                .build();

        HTTPUtil.request(model, response -> {
            if (Objects.isNull(response)) {
                completion.accept(null);
                return;
            }
            // get host, port, and protocol from server
            try {
                URL url = new URL(server);
                SiteEndpointModel endpoint = SiteEndpointModel.builder()
                        .host(url.getHost())
                        .port(url.getPort() == -1 ? (url.getProtocol().equals("https") ? 443 : 80) : url.getPort())
                        .protocol(url.getProtocol())
                        .path(url.getPath() == null ? url.getPath() : "/")
                        .build();
                var siteModel = SiteModel.builder()
                        .user(UserModel.builder()
                                .siteId("5")
                                .id("")
                                .username(username)
                                .password(password)
                                .accessToken(token)
                                .build())
                        .endpoint(endpoint)
                        .build();
                completion.accept(siteModel);
            } catch (MalformedURLException | NullPointerException e) {
                log.error("Failed to parse server url: {}", server);
                log.error("Error: ", e);
            }
            completion.accept(null);
        });
    }

    public void getAlbums(Consumer<List<AlbumModel>> completion) {
        if (site == null ||
            site.getEndpoint() == null ||
            site.getAccessToken() == null ||
            site.getUser() == null) return;

        HTTPModel model = HTTPModel.builder()
                .url(site.getEndpoint().getBaseUrl() + "media/albums")
                .method("GET")
                .headers(Map.of("Authorization", site.getAccessToken()))
                .query(Map.of("id", "5"))
                .typeReference(new TypeReference<iPlayModel.Response<List<iPlayModel.AlbumModel>>>() {})
                .build();

        HTTPUtil.request(model, response -> {
            if (Objects.isNull(response)) {
                completion.accept(null);
                return;
            }
            if (response instanceof iPlayModel.Response<?> responseModel && responseModel.code == 200) {
                log.info("Albums: {}", responseModel.data);
                val albumItems = ((List<iPlayModel.AlbumModel>)responseModel.data).stream().map(item -> AlbumModel.builder()
                        .id(item.getId())
                        .title(item.getName())
                        .type("album")
                        .backdrop(item.getImage().getBackdrop())
                        .build()).collect(Collectors.toList());
                completion.accept(albumItems);
                return;
            }
            completion.accept(null);
        });
    }

    public void getAlbumLatestMedias(String id, Consumer<List<MediaModel>> completion) {
        if (site == null ||
            site.getEndpoint() == null ||
            site.getUser() == null) return;

        HTTPModel model = HTTPModel.builder()
                .url(site.getEndpoint().getBaseUrl() + "media/album/" + id)
                .method("GET")
                .headers(Map.of("Authorization", site.getAccessToken()))
                .query(Map.of(
                        "siteId", "5"
                ))
                .typeReference(new TypeReference<iPlayModel.Response<List<iPlayModel.MediaModel>>>() {})
                .build();

        HTTPUtil.request(model, response -> {
            if (Objects.isNull(response)) {
                completion.accept(null);
                return;
            }
            if (response instanceof iPlayModel.Response<?> responseModel && responseModel.code == 200) {
                val items = (List<iPlayModel.MediaModel>) responseModel.data;
                val finalItems = items.stream().map(iPlayModel.MediaModel::toMediaModel).collect(Collectors.toList());
                finalItems.forEach(item -> item.setLayoutType(MediaLayoutType.Backdrop));
                completion.accept(finalItems);
                return;
            }
            completion.accept(null);
        });
    }

    public void getMediasCount(Map<String, String> query, Consumer<Integer> completion) {
        if (site == null ||
                site.getEndpoint() == null ||
                site.getUser() == null) return;

        val fields = Map.of(
                "Recursive", "true",
                "ImageTypeLimit", "1",
                "EnableImageTypes", "Primary,Backdrop,Thumb",
                "MediaTypes", "",
                "X-Emby-Token", site.getAccessToken(),
                "Fields", "BasicSyncInfo,People,Genres,SortName,Overview,CanDelete,Container,PrimaryImageAspectRatio,Prefix,DateCreated,ProductionYear,Status,EndDate"
        );
        val params = new HashMap<String, String>();
        params.putAll(fields);
        params.putAll(query);
        HTTPModel model = HTTPModel.builder()
                .url(site.getEndpoint().getBaseUrl() + "emby/Users/" + site.getUserId() + "/Items")
                .method("GET")
                .query(params)
                .typeReference(new TypeReference<EmbyModel.EmbyPageableModel<EmbyModel.EmbyMediaModel>>() {})
                .build();

        HTTPUtil.request(model, response -> {
            if (Objects.isNull(response)) {
                completion.accept(0);
                return;
            }
            if (response instanceof EmbyModel.EmbyPageableModel<?>) {
                String baseUrl = site.getEndpoint().getBaseUrl();
                int count = ((EmbyModel.EmbyPageableModel<EmbyModel.EmbyMediaModel>) response).getTotalRecordCount();
                completion.accept(count);
                return;
            }
            completion.accept(0);
        });
    }

    @Override
    public void getAllMedias(Map<String, String> query, Consumer<Object> completion) {
        if (site == null ||
                site.getEndpoint() == null ||
                site.getUser() == null) return;

        val fields = Map.of(
                "Recursive", "true",
                "ImageTypeLimit", "1",
                "EnableImageTypes", "Primary,Backdrop,Thumb",
                "MediaTypes", "",
                "X-Emby-Token", site.getAccessToken(),
                "Fields", "BasicSyncInfo,People,Genres,SortName,Overview,CanDelete,Container,PrimaryImageAspectRatio,Prefix,DateCreated,ProductionYear,Status,EndDate"
        );
        val params = new HashMap<String, String>();
        params.putAll(fields);
        params.putAll(query);
        HTTPModel model = HTTPModel.builder()
                .url(site.getEndpoint().getBaseUrl() + "emby/Users/" + site.getUserId() + "/Items")
                .method("GET")
                .query(params)
                .typeReference(new TypeReference<EmbyModel.EmbyPageableModel<EmbyModel.EmbyMediaModel>>() {})
                .build();

        HTTPUtil.request(model, response -> {
            if (Objects.isNull(response)) {
                completion.accept(null);
                return;
            }
            if (response instanceof EmbyModel.EmbyPageableModel<?> pageableModel) {
                String baseUrl = site.getEndpoint().getBaseUrl();
                val totalRecordCount = pageableModel.getTotalRecordCount();
                val items = new ArrayList<EmbyModel.EmbyMediaModel>();
                items.addAll((List<EmbyModel.EmbyMediaModel>)pageableModel.getItems());
                val part_size = Integer.valueOf(params.getOrDefault("Limit", "50"));
                val latch = new CountDownLatch((int)Math.ceil(totalRecordCount * 1.0f / part_size) - 1);
                for (int i = items.size(); i < totalRecordCount; i+=part_size) {
                    params.put("StartIndex", String.valueOf(i));
                    model.setQuery(params);
                    HTTPUtil.request(model, res -> {
                        if (res instanceof EmbyModel.EmbyPageableModel<?> pageable) {
                            items.addAll((List<EmbyModel.EmbyMediaModel>)pageable.getItems());
                        }
                        latch.countDown();
                    });
                }
                try {
                    latch.await();
                    items.forEach(item -> item.buildImage(baseUrl));
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                } finally {
                    if (completion != null) completion.accept(items);
                }
                return;
            }
            completion.accept(null);
        });
    }

    public void getMedias(Map<String, String> query, Consumer<List<MediaModel>> completion) {
        if (site == null ||
                site.getEndpoint() == null ||
                site.getUser() == null) return;

        val params = new HashMap<String, String>();
        params.put("keyword", query.get("SearchTerm"));
        if (query.get("PersonIds") != null) {
            params.put("actorId", query.get("PersonIds"));
        }
        params.put("siteId", "5");
        HTTPModel model = HTTPModel.builder()
                .url(site.getEndpoint().getBaseUrl() + "media/search")
                .headers(Map.of(
                        "Authorization", site.getAccessToken()
                ))
                .method("GET")
                .query(params)
                .typeReference(new TypeReference<iPlayModel.Response<List<iPlayModel.MediaModel>>>() {})
                .build();

        HTTPUtil.request(model, response -> {
            if (Objects.isNull(response)) {
                completion.accept(null);
                return;
            }
            if (response instanceof iPlayModel.Response<?> responseModel && responseModel.code == 200) {
                val data = (List<iPlayModel.MediaModel>)responseModel.data;
                val items = data.stream().map(iPlayModel.MediaModel::toMediaModel).collect(Collectors.toList());
                if (query.get("PersonIds") != null) {
                    items.forEach(item -> item.setLayoutType(MediaLayoutType.Backdrop));
                }
                completion.accept(items);
                return;
            }
            completion.accept(null);
        });
    }

    public void getSeasons(String seriesId, Consumer<Object> completion) {
        if (site == null ||
                site.getEndpoint() == null ||
                site.getUser() == null) return;

        HTTPModel model = HTTPModel.builder()
                .url(site.getEndpoint().getBaseUrl() + "emby/Shows/" + seriesId + "/Seasons")
                .method("GET")
                .query(Map.of(
                        "X-Emby-Token", site.getAccessToken(),
                        "UserId", site.getUserId(),
                        "Fields", "BasicSyncInfo,People,Genres,SortName,Overview,CanDelete,Container,PrimaryImageAspectRatio,Prefix,DateCreated,ProductionYear,Status,EndDate"
                ))
                .typeReference(new TypeReference<EmbyModel.EmbyPageableModel<EmbyModel.EmbyMediaModel>>() {})
                .build();

        HTTPUtil.request(model, response -> {
            if (Objects.isNull(response)) {
                completion.accept(null);
                return;
            }
            if (response instanceof EmbyModel.EmbyPageableModel<?>) {
                String baseUrl = site.getEndpoint().getBaseUrl();
                List<EmbyModel.EmbyMediaModel> items = ((EmbyModel.EmbyPageableModel<EmbyModel.EmbyMediaModel>) response).getItems();
                items.forEach(item -> item.buildImage(baseUrl));
                completion.accept(items);
                return;
            }
            completion.accept(null);
        });
    }

    public void getEpisodes(String seriesId, String seasonId, Consumer<Object> completion) {
        if (site == null ||
                site.getEndpoint() == null ||
                site.getUser() == null) return;

        HTTPModel model = HTTPModel.builder()
                .url(site.getEndpoint().getBaseUrl() + "emby/Shows/" + seriesId + "/Episodes")
                .method("GET")
                .query(Map.of(
                        "X-Emby-Token", site.getAccessToken(),
                        "UserId", site.getUserId(),
                        "SeasonId", seasonId,
                        "Fields", "BasicSyncInfo,People,Genres,SortName,Overview,CanDelete,Container,PrimaryImageAspectRatio,Prefix,DateCreated,ProductionYear,Status,EndDate"
                ))
                .typeReference(new TypeReference<EmbyModel.EmbyPageableModel<EmbyModel.EmbyMediaModel>>() {})
                .build();

        HTTPUtil.request(model, response -> {
            if (Objects.isNull(response)) {
                completion.accept(null);
                return;
            }
            if (response instanceof EmbyModel.EmbyPageableModel<?>) {
                String baseUrl = site.getEndpoint().getBaseUrl();
                List<EmbyModel.EmbyMediaModel> items = ((EmbyModel.EmbyPageableModel<EmbyModel.EmbyMediaModel>) response).getItems();
                items.forEach(item -> item.buildImage(baseUrl));
                completion.accept(items);
                return;
            }
            completion.accept(null);
        });
    }

    public void getPlayback(String id, Consumer<Object> completion) {
        if (site == null ||
            site.getEndpoint() == null ||
            site.getUser() == null) return;

        val store = XGET(GlobalStore.class);
        val media = store.getDataSource().getMediaMap().get(id);
        HTTPModel model = HTTPModel.builder()
                .url(site.getEndpoint().getBaseUrl() + "media/source")
                .method("GET")
                .query(Map.of(
                    "siteId", "5",
                    "id", id
                ))
                .headers(Map.of(
                        "Authorization", site.getAccessToken()
                ))
                .typeReference(new TypeReference<iPlayModel.Response<List<iPlayModel.SourceModel>>>() {})
                .build();

        HTTPUtil.request(model, response -> {
            if (Objects.isNull(response)) {
                completion.accept(null);
                return;
            }
            if (response instanceof iPlayModel.Response<?> responseModel && responseModel.code == 200) {
                String siteBaseUrl = site.getEndpoint().getBaseUrl();
                if (siteBaseUrl.endsWith("/")) siteBaseUrl = siteBaseUrl.substring(0, siteBaseUrl.length()-1);
                String baseUrl = siteBaseUrl;
                val sources = (List<iPlayModel.SourceModel>)responseModel.data;
                val embySource = EmbyModel.EmbyPlaybackModel.builder()
                        .sessionId("0")
                        .mediaSources(sources.stream().map(source -> EmbyModel.EmbyMediaSource.builder()
                                .id(Objects.requireNonNullElse(source.getName(), "0"))
                                .name(Objects.requireNonNullElse(source.getName(), media.getName()))
                                .container("manifest")
                                .mediaStreams(List.of(
                                        EmbyModel.EmbyMediaStream.builder()
                                                .type("Video")
                                                .displayTitle(media.getName())
                                                .isExternal(true)
                                                .deliveryUrl(baseUrl + source.getUrl())
                                                .build()
                                ))
                                .path(baseUrl + source.getUrl())
                                .directStreamUrl(baseUrl + source.getUrl())
                                .build()).collect(Collectors.toList()))
                        .build();
                Collections.reverse(embySource.getMediaSources());
                completion.accept(embySource);
                return;
            }
            completion.accept(null);
        });
    }

    @Override
    public void getSimilar(String id, Consumer<Object> completion) {
        // /Items/{Id}/Similar
        if (site == null ||
                site.getEndpoint() == null ||
                site.getUser() == null) return;

        HTTPModel model = HTTPModel.builder()
                .url(site.getEndpoint().getBaseUrl() + "media/similar")
                .method("GET")
                .headers(Map.of(
                        "Authorization", site.getAccessToken()
                ))
                .method("GET")
                .query(Map.of(
                        "siteId", "5",
                        "id", id
                ))
                .typeReference(new TypeReference<iPlayModel.Response<List<iPlayModel.MediaModel>>>() {})
                .build();

        HTTPUtil.request(model, response -> {
            if (Objects.isNull(response)) {
                completion.accept(null);
                return;
            }
            if (response instanceof iPlayModel.Response<?> responseModel && responseModel.code == 200) {
                var items = (List<iPlayModel.MediaModel>)responseModel.data;
                var mediaItems = items.stream().map(iPlayModel.MediaModel::toMediaModel).collect(Collectors.toList());
                mediaItems.forEach(item -> item.setLayoutType(MediaLayoutType.Backdrop));
                completion.accept(mediaItems);
                return;
            }
            completion.accept(null);
        });
    }

    public void getResume(Consumer<Object> completion) {
        completion.accept(null);
    }

    public void markFavorite(String id, boolean isFavorite, Consumer<Object> completion) {
        if (site == null ||
                site.getEndpoint() == null ||
                site.getUser() == null) return;

        HTTPModel model = HTTPModel.builder()
                .url(site.getEndpoint().getBaseUrl() + "emby/Users/" + site.getUserId() + "/FavoriteItems/" + id + (isFavorite ? "/" : "/Delete"))
                .method("POST")
                .body("")
                .query(Map.of(
                        "X-Emby-Token", site.getAccessToken()
                ))
                .modelClass(EmbyModel.EmbyUserData.class)
                .build();

        HTTPUtil.request(model, response -> {
            if (Objects.isNull(response)) {
                completion.accept(null);
                return;
            }
            if (response instanceof EmbyModel.EmbyUserData) {
                completion.accept(response);
                return;
            }
            completion.accept(null);
        });
    }

    @Override
    public void getRecommendations(Consumer<Object> completion) {
        if (site == null ||
                site.getEndpoint() == null ||
                site.getUser() == null) return;

        completion.accept(List.of());
    }

    public void trackPlay(MediaPlayState state, EmbyModel.EmbyPlaybackData data, Consumer<Object> completion) {
        if (site == null ||
                site.getEndpoint() == null ||
                site.getUser() == null) return;

        val playState = switch (state) {
            case STOPPED -> "Stopped";
            case PLAYING -> "Progress";
            default -> "";
        };

        HTTPModel model = HTTPModel.builder()
                .url(site.getEndpoint().getBaseUrl() + "emby/Sessions/Playing/" + playState)
                .method("POST")
                .body(XGET(JSONAdapter.class).toJSON(data))
                .headers(Map.of(
                        "X-Emby-Token", site.getAccessToken(),
                        "Content-Type", "application/json",
                        "reqformat", "json"
                ))
                .modelClass(EmbyModel.EmbyUserData.class)
                .build();

        HTTPUtil.request(model, response -> {
            if (Objects.isNull(response)) {
                completion.accept(null);
                return;
            }
            if (response instanceof EmbyModel.EmbyUserData) {
                completion.accept(response);
                return;
            }
            completion.accept(null);
        });

    }

    @Override
    public void getSiteInfo(Consumer<Object> completion) {
        if (site == null ||
                site.getEndpoint() == null ||
                site.getUser() == null) return;

        // /emby/system/info/public
        HTTPModel model = HTTPModel.builder()
                .url(site.getEndpoint().getBaseUrl() + "emby/system/info/public")
                .method("GET")
                .modelClass(EmbyModel.EmbySiteInfo.class)
                .build();

        HTTPUtil.request(model, response -> {
            if (Objects.isNull(response)) {
                completion.accept(null);
                return;
            }
            if (response instanceof EmbyModel.EmbySiteInfo) {
                completion.accept(response);
                return;
            }
            completion.accept(null);
        });
    }
}
