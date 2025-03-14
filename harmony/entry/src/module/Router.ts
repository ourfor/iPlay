import { nil } from "../api/iPlayDataSource";
import { router as officialRouter } from "@kit.ArkUI";

export type Dict = {
  [key: string]: any | nil;
};

export interface Router {
  pushPage(name: string, params: Dict);
  popPage();
  canGoBack(): boolean;
  goBack();
  params(): Dict;
}


class ArkTsRouter implements Router {
  pushPage(name: string, params: Dict): void {
    officialRouter.pushUrl({
      url: name,
      params
    }, officialRouter.RouterMode.Standard)
  }

  popPage(): void {
    officialRouter.back()
  }

  canGoBack(): boolean {
    return true;
  }

  goBack(): void {
    officialRouter.back()
  }

  params(): Dict {
    return officialRouter.getParams()
  }
}

export const router: Router = new ArkTsRouter()