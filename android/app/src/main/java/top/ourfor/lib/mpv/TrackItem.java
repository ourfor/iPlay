package top.ourfor.lib.mpv;

import androidx.annotation.NonNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.With;

@With
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackItem {
    public static String VideoTrackName = "video";
    public static String AudioTrackName = "audio";
    public static String SubtitleTrackName = "sub";

    public String lang;
    public String type;
    public String title;
    public String id;
    public String prefix;


    @NonNull
    @Override
    public String toString() {
        return prefix + lang + " " + title;
    }
}
