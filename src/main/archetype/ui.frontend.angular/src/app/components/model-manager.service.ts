import { ModelManager } from '@adobe/cq-spa-page-model-manager';
import { Injectable } from '@angular/core';

export interface DataConfig {
  path?: string;
  immutable?: boolean;
  forceReload?: boolean;
}

@Injectable()
export class ModelManagerService {
  getData(cfg: DataConfig) {
    return ModelManager.getData(cfg);
  }
}
