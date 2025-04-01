import video from '@ohos.multimedia.media';
import window from '@ohos.window';
import { BusinessError } from '@ohos.base';
import { Dict, router } from '../../../module/Router';
import { PlaybackModel } from '../../../api/iPlayDataSource';
import { FontIcon } from '../view/FontIcon';
import { IconDef } from '../view/IconDef';

@Entry
@Component
struct FullscreenVideoPlayer {
  private controller: VideoController = new VideoController();
  @State params: Dict = router.params()
  @State isPlaying: boolean = true;
  @State currentTime: number = 0;
  @State duration: number = 0;
  @State isFullScreen: boolean = false;

  private videoSrc: string = '';

  // 获取窗口对象
  private windowClass: window.Window | null = null;

  aboutToAppear() {
    let playback = this.params["playback"] as PlaybackModel
    if (playback != undefined) {
      this.videoSrc = playback.sources?.[0].url ?? ""
    }
    window.getLastWindow(this.getUIContext().getHostContext()).then((win: window.Window) => {
      this.windowClass = win;
      let block = async () => {
        await win.setPreferredOrientation(window.Orientation.LANDSCAPE);
        await win.setWindowSystemBarEnable([]); // 隐藏状态栏
        await win.setWindowLayoutFullScreen(true);
        this.isFullScreen = true
      }
      block()
    });
  }

  build() {
    Stack() {
      this.VideoPlayerComponent()
      this.ControlPanel()
    }
    .onClick(() => {
      this.toggleControls()
    })
  }

  @Builder VideoPlayerComponent() {
    Column() {
      Video({
        src: this.videoSrc,
        controller: this.controller
      })
        .width(this.isFullScreen ? '100%' : '100%')
        .height(this.isFullScreen ? '100%' : 300)
        .onPrepared((event) => {
          this.duration = event.duration
        })
        .autoPlay(true)
        .objectFit(ImageFit.Auto)
        .controls(false)
        .onUpdate((event) => {
          this.currentTime = event.time;
        })
    }
    .width('100%')
    .height(this.isFullScreen ? '100%' : 300)
    .onClick(() => {
      this.toggleControls()
    })
  }

  @Builder ControlPanel() {
      Column() {
        Row() {
          Text("Title")
            .fontColor("#ffffffff")
            .margin({top: 10})
        }
        .flexGrow(0)
        Row() {
          FontIcon({
            icon: IconDef.ic_fluent_device_eq_24_filled
          })
            .margin(5)
          FontIcon({
            icon: IconDef.ic_fluent_closed_caption_24_filled
          })
            .margin(5)
        }
        .justifyContent(FlexAlign.End)
        .width('90%')
        Row(){

        }
        .flexGrow(1)
        Row() {
          FontIcon({
            icon: IconDef.ic_fluent_skip_back_10_24_filled
          })
            .margin(5)
            .onClick(() => {
              this.controller.setCurrentTime(this.currentTime - 10)
            })
          FontIcon({
            icon: this.isPlaying ? IconDef.ic_fluent_pause_32_filled : IconDef.ic_fluent_play_24_filled
          })
            .margin(5)
            .onClick(() => {
              this.togglePlayback()
            })
          FontIcon({
            icon: IconDef.ic_fluent_skip_forward_10_24_filled
          })
            .margin(5)
            .onClick(() => {
              this.controller.setCurrentTime(this.currentTime + 10)
            })
          Column()
            .flexGrow(1)
          FontIcon({
            icon: IconDef.ic_fluent_top_speed_24_filled
          })
            .margin(5)
          FontIcon({
            icon: IconDef.ic_fluent_orientation_24_filled
          })
            .margin(5)
          FontIcon({
            icon: IconDef.ic_fluent_news_24_filled
          })
            .margin(5)
        }
        .width('90%')
        .flexGrow(0)
        .margin({bottom: 5})
        Row() {
          Slider({
            value: this.currentTime,
            min: 0,
            max: this.duration,
            step: 1
          })
            .width('90%')
            .backgroundColor('#75737373')
            .borderRadius(10)
            .padding({left: 10, right: 10})
            .margin({bottom: 10})
            .onChange((value: number) => {
              // seek
              this.controller.setCurrentTime(value)
            })
        }
        .flexShrink(0)
      }
      .backgroundColor("#00000000")
      .height('100%')
      .width('100%')
      .visibility(this.showControls ? Visibility.Visible : Visibility.Hidden)
  }

  private async toggleFullscreen() {
    if (!this.windowClass) return;

    try {
      if (!this.isFullScreen) {
        await this.windowClass.setPreferredOrientation(window.Orientation.LANDSCAPE);
        await this.windowClass.setWindowSystemBarEnable([]); // 隐藏状态栏
        await this.windowClass.setWindowLayoutFullScreen(true);
        this.isFullScreen = true;
        this.controller.requestFullscreen(true);
      } else {
        await this.windowClass.setPreferredOrientation(window.Orientation.PORTRAIT);
        await this.windowClass.setWindowSystemBarEnable(['status', 'navigation']);
        await this.windowClass.setWindowLayoutFullScreen(false);
        this.isFullScreen = false;
        this.controller.exitFullscreen();
      }
    } catch (error) {
      console.error('全屏切换失败:', (error as BusinessError).message);
    }
  }

  @State showControls: boolean = true;
  private toggleControls() {
    this.showControls = !this.showControls;
  }

  private togglePlayback() {
    this.isPlaying ? this.controller.pause() : this.controller.start();
    this.isPlaying = !this.isPlaying;
  }

  private formatTime(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  aboutToDisappear() {
    if (this.windowClass) {
      this.windowClass.setPreferredOrientation(window.Orientation.PORTRAIT);
    }
  }
}