package top.ourfor.app.iplayx.model;


import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.With;

@Data
@With
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class EmbyPlaybackModel {
    @JsonProperty("PlaySessionId")
    String sessionId;
    @JsonProperty("MediaSources")
    List<EmbyMediaSource> mediaSources;

    public void buildUrl(String baseUrl) {
        if (baseUrl.endsWith("/")) baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
        for (EmbyMediaSource mediaSource : mediaSources) {
            mediaSource.buildUrl(baseUrl);
        }
    }
}
