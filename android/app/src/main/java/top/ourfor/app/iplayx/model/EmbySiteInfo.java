package top.ourfor.app.iplayx.model;

import com.fasterxml.jackson.annotation.JsonProperty;

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
public class EmbySiteInfo {
    @JsonProperty("ServerName")
    String ServerName;
    @JsonProperty("Version")
    String Version;
    @JsonProperty("Id")
    String Id;
}
