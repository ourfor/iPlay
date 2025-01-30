package top.ourfor.app.iplayx.page.album;

import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import lombok.Getter;
import lombok.NoArgsConstructor;
import top.ourfor.app.iplayx.api.emby.EmbyModel;

@Getter
@NoArgsConstructor
public class AlbumViewModel extends ViewModel {
    private final MutableLiveData<List<EmbyModel.EmbyMediaModel>> medias = new MutableLiveData<>(new CopyOnWriteArrayList<>());
}
