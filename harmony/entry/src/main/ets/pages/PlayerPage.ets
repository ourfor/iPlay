import video from '@ohos.multimedia.media';
import window from '@ohos.window';
import { BusinessError } from '@ohos.base';

@Entry
@Component
struct FullscreenVideoPlayer {
  private controller: VideoController = new VideoController();
  @State isPlaying: boolean = false;
  @State currentTime: number = 0;
  @State duration: number = 0;
  @State isFullScreen: boolean = false;

  // 视频源配置
  private videoSrc: string = 'https://test/breaking-bad.mp4';

  // 获取窗口对象
  private windowClass: window.Window | null = null;

  aboutToAppear() {
    window.getLastWindow(this.getUIContext().getHostContext()).then((win: window.Window) => {
      this.windowClass = win;
    });
  }

  build() {
    Column() {
      this.VideoPlayerComponent()

      if (!this.isFullScreen) {
        this.ControlPanel()
      }
    }
    .onClick(() => {
      if (this.isFullScreen) {
        this.toggleControls();
      }
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
        .onPrepared(() => {
        })
        .onUpdate((event) => {
          this.currentTime = event.time;
        })
    }
    .width('100%')
    .height(this.isFullScreen ? '100%' : 300)
  }

  @Builder ControlPanel() {
    Column() {
      Slider({
        value: this.currentTime,
        min: 0,
        max: this.duration,
        step: 1
      })
        .width('90%')
        .onChange((value: number) => {
          // seek
        })

      Row({ space: 20 }) {
        Button(this.isPlaying ? '⏸' : '▶')
          .onClick(() => this.togglePlayback())

        Text(`${this.formatTime(this.currentTime)}/${this.formatTime(this.duration)}`)
          .fontSize(14)

        Button('⛶')
          .onClick(() => this.toggleFullscreen())
      }
      .padding(10)
    }
    .backgroundColor('#CC000000')
    .width('100%')
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