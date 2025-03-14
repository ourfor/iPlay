import { EmbyApi } from '../../../api/emby/EmbyApi';
import { ActorModel, MediaModel, nil, SiteModel } from '../../../api/iPlayDataSource'
import { logger } from '../../../module/Log';
import { Dict, router } from '../../../module/Router'
import { store } from '../store/Store';
import { ActorCellView } from '../view/ActorCellView'
import { promptAction } from '@kit.ArkUI';

@Entry
@Component
struct LoginPage {
  @State serverAddress: string = '';
  @State username: string = '';
  @State password: string = '';

  build() {
    Column() {
      Row() {
        Text('服务器')
          .fontSize(16)
          .margin({ right: 10 })

        TextInput({ text: this.serverAddress, placeholder: "http://media.emby.com:8096" })
          .type(InputType.Normal)
          .width('80%')
          .height(40)
          .flexGrow(1)
          .border({ width: 1, color: '#cccccc' })
          .borderRadius(4)
          .onChange((value: string) => {
            this.serverAddress = value;
          })
      }
      .width('100%')

      Row() {
        Text('用户名')
          .fontSize(16)
          .margin({ right: 10 })

        TextInput({ text: this.username, placeholder: "guest" })
          .type(InputType.Normal)
          .width('80%')
          .flexGrow(1)
          .height(40)
          .border({ width: 1, color: '#cccccc' })
          .borderRadius(4)
          .onChange((value: string) => {
            this.username = value;
          })
      }
      .width('100%')
      .margin({top: 15})


      Row() {
        Text('密　码')
          .fontSize(16)
          .margin({ right: 10 })

        TextInput({ text: this.password, placeholder: "password" })
          .type(InputType.Password)
          .width('80%')
          .height(40)
          .flexGrow(1)
          .border({ width: 1, color: '#cccccc' })
          .borderRadius(4)
          .onChange((value: string) => {
            this.password = value;
          })
      }
      .width('100%')
      .margin({top: 15})


      Button('登 录')
        .width('90%')
        .height(40)
        .margin({ top: 30 })
        .backgroundColor('#007DFF')
        .fontColor(Color.White)
        .onClick(() => {
          if (this.serverAddress && this.username && this.password) {
            console.log('尝试登录：', this.serverAddress);
            let api = new EmbyApi()
            let site: SiteModel = {
              id: null,
              type: "emby",
              server: this.serverAddress,
              user: {
                id: null,
                username: this.username,
                password: this.password,
                accessToken: null,
              },
              extra: undefined
            }
            api.login(site).then(site => {
                store.api = api
                store.addSite(site)
                logger.info(`${site}`)
              this.getUIContext().getPromptAction().showToast({
                message: `登录成功`,
                duration: 2000,
                bottom: '50%',
              });
              setTimeout(() => {
                this.getUIContext().getRouter().back()
              })
            }).catch((err: object) => {
              logger.error(`${err}`)
              this.getUIContext().getPromptAction().showToast({
                message: `${err}`,
                duration: 2000,  // 显示时长（毫秒）
                bottom: '50%'   // 距离底部位置
              });
            })
          } else {
            this.getUIContext().getPromptAction().showToast({
              message: `请填写完整登录信息`,
              duration: 2000,  // 显示时长（毫秒）
              bottom: '50%'   // 距离底部位置
            });
            console.error('请填写完整登录信息');
          }
        })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Start)
    .alignItems(HorizontalAlign.Center)
    .padding(10)
  }
}