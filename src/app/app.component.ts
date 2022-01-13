import { Component } from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { MetaserviceService } from 'src/@theme/Services/metaservice.service';

declare var gtag;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ANO';

  constructor(router: Router, private MetaserviceService: MetaserviceService) {
    const navEndEvent$ = router.events.pipe(
      filter((e) => e instanceof NavigationEnd)
    );
    navEndEvent$.subscribe((e: NavigationEnd) => {
      gtag('config', 'G-2HW8C3X8NN', { page_path: e.urlAfterRedirects });
    });
  }

  ngOnInit() {
    this.MetaserviceService.createCanonicalURL();
  }
}
