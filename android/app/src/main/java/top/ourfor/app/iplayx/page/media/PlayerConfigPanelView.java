package top.ourfor.app.iplayx.page.media;

import static top.ourfor.app.iplayx.module.Bean.XGET;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Spinner;

import androidx.annotation.NonNull;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import top.ourfor.app.iplayx.bean.Navigator;
import top.ourfor.app.iplayx.databinding.PlayerConfigPanelBinding;
import top.ourfor.app.iplayx.model.EmbyMediaModel;
import top.ourfor.app.iplayx.view.LifecycleHolder;
import top.ourfor.app.iplayx.view.video.PlayerSourceModel;

@Slf4j
@SuppressLint("ViewConstructor")
public class PlayerConfigPanelView extends LifecycleHolder {
    PlayerConfigPanelBinding binding;
    @Getter
    PlayerConfigPanelViewModel viewModel = new PlayerConfigPanelViewModel();

    @Getter @Setter
    Consumer<View> onPlayButtonClick;

    PlayerSourceModel videoSource;
    PlayerSourceModel audioSource;
    PlayerSourceModel subtitleSource;

    public PlayerConfigPanelView(@NonNull Context context, EmbyMediaModel media) {
        super(context);
        viewModel.getMedia().setValue(media);
        binding = PlayerConfigPanelBinding.inflate(LayoutInflater.from(context), this, true);
        val layout = new LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        setLayoutParams(layout);
        bind();
    }

    private void bind() {
        Consumer<PlayerConfigPanelViewModel.MediaSourceConfigModel> onMediaSourceUpdate = (model) -> {
            if (model == null) return;
            log.info("media source model: {}", model);
            post(() -> {
                configSource(binding.videoSource, model.getVideos(), null);
                configSource(binding.audioSource, model.getAudios(), null);
                configSource(binding.subtitleSource, model.getSubtitles(), null);
                binding.loading.pauseAnimation();
                binding.loading.setVisibility(View.GONE);
            });
        };
        viewModel.getMediaSource().observe(this, onMediaSourceUpdate::accept);

        viewModel.fetchMediaSource(onMediaSourceUpdate);

        binding.play.setOnClickListener(v -> {
            if (onPlayButtonClick != null) {
                onPlayButtonClick.accept(v);
            }

            var navigator = XGET(Navigator.class);
            assert navigator != null;
            navigator.pushPage("movie_player_page", Map.of(
                    "source", PlayerConfigPanelViewModel.MediaSourceModel.builder()
                            .media(Objects.requireNonNull(viewModel.getMedia().getValue()))
                            .video(videoSource)
                            .audio(audioSource)
                            .subtitle(subtitleSource)
                            .build()
            ));
        });
    }

    void configSource(Spinner spinner, List<PlayerSourceModel> sourceModels, PlayerSourceModel model) {
        val options = sourceModels.stream().map(PlayerSourceModel::getName).collect(Collectors.toList());
        if (options.isEmpty()) {
            return;
        }
        val value = model == null ? options.get(0) : model.getName();
        val adapter = new ArrayAdapter<>(getContext(), android.R.layout.simple_spinner_item, options);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner.setAdapter(adapter);
        spinner.setSelection(options.indexOf(value));
        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                if (options.size() <= position) return;
                val model = sourceModels.get(position);
                val newPlaySource = PlayerSourceModel.builder().name(model.getName()).url(model.getUrl()).build();
                if (spinner == binding.videoSource) {
                    videoSource = newPlaySource;
                } else if (spinner == binding.audioSource) {
                    audioSource = newPlaySource;
                } else if (spinner == binding.subtitleSource) {
                    subtitleSource = newPlaySource;
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });
    }
}
