import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {AppModule} from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

registerLocaleData(localeFr, 'fr-FR');
