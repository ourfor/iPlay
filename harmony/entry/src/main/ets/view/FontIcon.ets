import { font } from "@kit.ArkUI";
import { IconDef } from "./IconDef";


@Component
export struct FontIcon {
  @Prop icon: string = ""
  @Prop iconSize: number = 24
  @Prop iconColor: string = "#ffffffff"

  aboutToAppear() {
    font.registerFont({
      familyName: 'iconfont',
      familySrc: $rawfile('FluentSystemIcons_Filled.ttf')
    })
  }

  build() {
    Text(this.icon)
      .fontSize(this.iconSize)
      .fontFamily("iconfont")
      .fontColor(this.iconColor)
      .backgroundColor("#55e5e5e5")
      .padding(this.iconSize/2)
      .borderRadius(this.iconSize)
  }
}