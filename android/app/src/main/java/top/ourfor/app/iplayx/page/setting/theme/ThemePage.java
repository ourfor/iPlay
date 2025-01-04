package top.ourfor.app.iplayx.page.setting.theme;

import static top.ourfor.app.iplayx.module.Bean.XGET;

import android.content.Context;
import android.view.View;

import androidx.constraintlayout.widget.ConstraintLayout;

import java.util.List;
import java.util.Map;

import lombok.Getter;
import lombok.val;
import top.ourfor.app.iplayx.R;
import top.ourfor.app.iplayx.action.LayoutUpdateAction;
import top.ourfor.app.iplayx.action.NavigationTitleBar;
import top.ourfor.app.iplayx.common.annotation.ViewController;
import top.ourfor.app.iplayx.common.type.LayoutType;
import top.ourfor.app.iplayx.config.AppSetting;
import top.ourfor.app.iplayx.module.FontModule;
import top.ourfor.app.iplayx.page.Page;
import top.ourfor.app.iplayx.page.setting.common.OptionModel;
import top.ourfor.app.iplayx.util.LayoutUtil;
import top.ourfor.app.iplayx.page.setting.common.SettingModel;
import top.ourfor.app.iplayx.page.setting.common.SettingType;
import top.ourfor.app.iplayx.page.setting.common.SettingViewCell;
import top.ourfor.app.iplayx.util.WindowUtil;
import top.ourfor.app.iplayx.view.ListView;

@ViewController(name = "theme_page")
public class ThemePage implements Page {
    private ConstraintLayout contentView = null;
    private List<SettingModel> settingModels = null;
    private ListView<SettingModel> listView = null;

    @Getter
    Context context;

    public void init() {
        val themeOptions = List.of(
                new ThemeModel(ThemeModel.ThemeType.FOLLOW_SYSTEM, getContext().getString(R.string.theme_follow_system)),
                new ThemeModel(ThemeModel.ThemeType.DARK_MODE, getContext().getString(R.string.theme_dark_mode)),
                new ThemeModel(ThemeModel.ThemeType.LIGHT_MODE, getContext().getString(R.string.theme_light_mode))
        );
        var defaultThemeOption = themeOptions.get(0);
        for (val option : themeOptions) {
            if (option.type == AppSetting.shared.appearance) {
                defaultThemeOption = option;
                break;
            }
        }

        val layoutOptions = List.of(
                new OptionModel<>(LayoutType.Auto, getContext().getString(R.string.video_decode_auto)),
                new OptionModel<>(LayoutType.Phone, getContext().getString(R.string.layout_type_phone)),
                new OptionModel<>(LayoutType.TV, getContext().getString(R.string.layout_type_tv))
        );
        var defaultLayoutOption = layoutOptions.get(0);
        for (val option : layoutOptions) {
            if (option.value == AppSetting.shared.layoutType) {
                defaultLayoutOption = option;
                break;
            }
        }

        settingModels = List.of(
                SettingModel.builder()
                        .title(getContext().getString(R.string.theme_appearance))
                        .value(defaultThemeOption)
                        .options(themeOptions)
                        .onClick(object -> {
                            if (!(object instanceof ThemeModel option)) return;
                            val titleBar = XGET(NavigationTitleBar.ThemeManageAction.class);
                            assert titleBar != null;
                            switch (option.type) {
                                case FOLLOW_SYSTEM:
                                    titleBar.switchToAutoModel();
                                    break;
                                case DARK_MODE:
                                    titleBar.switchToDarkMode(true);
                                    break;
                                case LIGHT_MODE:
                                    titleBar.switchToDarkMode(false);
                                    break;
                            }
                            AppSetting.shared.appearance = option.type;
                            AppSetting.shared.save();
                        })
                        .type(SettingType.SELECT)
                        .build(),
                SettingModel.builder()
                        .title(getContext().getString(R.string.theme_layout_mode))
                        .value(defaultLayoutOption)
                        .options(layoutOptions)
                        .onClick(object -> {
                            if (!(object instanceof OptionModel)) return;
                            val option = (OptionModel<LayoutType>) object;
                            AppSetting.shared.layoutType = option.value;
                            XGET(LayoutUpdateAction.class).switchLayoutMode(option.value);
                            AppSetting.shared.save();
                        })
                        .type(SettingType.SELECT)
                        .build(),
                SettingModel.builder()
                        .title(getContext().getString(R.string.theme_font))
                        .value(AppSetting.shared.fontFamily)
                        .options(FontModule.getFontFamilyList())
                        .onClick(object -> {
                            if (!(object instanceof String)) return;

                            AppSetting.shared.fontFamily = (String) object;
                            AppSetting.shared.save();
                        })
                        .type(SettingType.SPINNER)
                        .build()
        );
    }

    public void setup() {
        contentView = new ConstraintLayout(getContext());
        setupUI(context);
        bind();
        contentView.setPadding(0, WindowUtil.defaultToolbarBottom, 0, 0);
    }

    void setupUI(Context context) {
        listView = new ListView<>(context);
        listView.viewModel.viewCell = SettingViewCell.class;
        contentView.addView(listView, LayoutUtil.fill());
    }

    void bind() {
        listView.setItems(settingModels);
    }

    @Override
    public void create(Context context, Map<String, Object> params) {
        this.context = context;
        init();
        setup();
    }

    @Override
    public View view() {
        return contentView;
    }

    @Override
    public int id() {
        return R.id.themePage;
    }
}
