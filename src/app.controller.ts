import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Render('survey')
  @Get('/survey')
  renderSurvey() {
    return;
  }

  @Render('test')
  @Get('/test')
  renderTest() {
    return;
  }
}
