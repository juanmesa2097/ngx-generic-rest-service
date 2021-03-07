import { NgxGenericRestService } from './ngx-generic-rest.service';

export interface TestEntity {
  id: string | number;
  foo: string;
  bar: number;
}

export class TestService extends NgxGenericRestService {
  constructor() {
    super({
      baseUrl: 'inline-base-url',
      resourceName: 'inline-resource-name',
    });
  }
}
